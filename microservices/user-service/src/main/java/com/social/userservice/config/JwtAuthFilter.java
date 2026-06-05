package com.social.userservice.config;

import com.social.userservice.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 1. On récupère l'en-tête "Authorization"
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Si l'en-tête est absent ou ne commence pas par "Bearer ", on passe au filtre suivant (la requête sera sûrement bloquée plus tard)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. On extrait le token (en enlevant les 7 premiers caractères : "Bearer ")
        jwt = authHeader.substring(7);
        
        // 4. On extrait l'email depuis le token
        userEmail = jwtService.extractUsername(jwt);

        // 5. Si on a un email et que l'utilisateur n'est pas déjà authentifié dans le contexte actuel
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // On récupère l'utilisateur depuis la base de données
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            
            // On vérifie si le token est valide (bonne signature, pas expiré, appartient bien à cet utilisateur)
            // (Note: Il faut ajouter la méthode isTokenValid dans JwtService si tu ne l'as pas déjà fait)
            if (jwtService.extractUsername(jwt).equals(userDetails.getUsername())) {
                
                // On crée l'objet d'authentification officiel pour Spring Security
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // On informe Spring Security que cet utilisateur est maintenant connecté !
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // 6. On passe la main au filtre suivant
        filterChain.doFilter(request, response);
    }
}