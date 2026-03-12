<?php
/**
 * Plugin Name: Flowbite ACF Blocks
 * Description: Blocs ACF Flexible Content basés sur Flowbite pour le frontend Astro headless.
 * Version: 1.0.0
 * Author: Orlane
 * Requires Plugins: advanced-custom-fields-pro
 * Text Domain: flowbite-acf-blocks
 */

if (!defined('ABSPATH')) {
    exit;
}



// Désactive Gutenberg
add_filter('use_block_editor_for_post', '__return_false');
add_filter('use_widgets_block_editor', '__return_false');

// ── Enregistre les emplacements de menus (footer) ─────────────────────
add_action('after_setup_theme', function (): void {
    register_nav_menus([
        'footer_1' => 'Footer — Colonne 1',
        'footer_2' => 'Footer — Colonne 2',
        'footer_3' => 'Footer — Colonne 3',
        'footer_4' => 'Footer — Colonne 4',
    ]);
});

// ── Icônes SVG Flowbite pour les layouts ACF Flexible Content ──────────
add_action('admin_head', function (): void {
    $screen = get_current_screen();
    if (!$screen || !in_array($screen->base, ['post', 'toplevel_page_theme-settings'], true)) {
        return;
    }

    // Icônes SVG Flowbite (outline, 24x24, currentColor)
    $icons = [
        'fb_hero_section'           => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11V4m4 4-4-4-4 4m9 7H7m11 4H6a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"/>',
        'fb_hero_homepage'          => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>',
        'fb_features_section'       => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"/>',
        'fb_cta_section'            => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"/>',
        'fb_content_section'        => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M9 3v4a1 1 0 0 1-1 1H4m9 4h2m-2 3h2m-2-6h2M9 7h2m-2 3h2"/>',
        'fb_testimonials_section'   => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.556 2h9.889C20.09 2 22 3.91 22 6.556v5.89C22 15.09 20.09 17 17.444 17H14l-5 4v-4H7.556C4.91 17 3 15.09 3 12.444V6.556C3 3.91 4.91 2 7.556 2Z"/>',
        'fb_pricing_section'        => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.49.487-1.866 2.725-2.899 4.999-2.31A4.76 4.76 0 0 1 16 6.655M12 2v20"/>',
        'fb_faq_section'            => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.529 9.988a2.502 2.502 0 1 1 2.666 2.475M12 15h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>',
        'fb_team_section'           => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.99 9H15M8.99 9H9m12 3a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM7 13c0 1 .507 2.397 1.494 3.216a5.5 5.5 0 0 0 7.022 0C16.503 15.397 17 14 17 13c0 0-1.99 1-5 1s-5-1-5-1Z"/>',
        'fb_contact_section'        => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1"/>',
        'fb_newsletter_section'     => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1"/>',
        'fb_stats_section'          => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207"/>',
        'fb_gallery_section'        => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>',
        'fb_social_proof_section'   => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022 4.342.557c.866.111 1.211 1.175.585 1.8l-3.155 3.116.757 4.382c.15.863-.754 1.528-1.53 1.123L12 18.202l-3.868 2.102c-.776.405-1.68-.26-1.53-1.123l.757-4.382L4.204 11.483c-.626-.625-.28-1.689.585-1.8l4.342-.557 1.752-4.022Z"/>',
        'fb_customer_logos_section'  => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 6-5"/>',
        'fb_blog_section'           => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7h1v12a1 1 0 0 1-2 0V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10H7v5h6V7Z"/>',
        'fb_portfolio_section'      => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8M7 11V7a5 5 0 0 1 10 0v4m-4.5 8H20a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-8"/>',
        'fb_banner_section'         => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C19 17.4 19 18 18.462 18H5.538C5 18 5 17.4 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"/>',
        'fb_event_schedule_section' => '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>',
    ];

    echo '<style>';
    echo '/* Flowbite icons for ACF Flexible Content layouts */';
    foreach ($icons as $layout => $svg_path) {
        $svg = rawurlencode('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">' . $svg_path . '</svg>');
        // Cible le bouton d'ajout dans le popup et le label du layout replié
        echo ".acf-fc-popup a[data-layout=\"{$layout}\"]::before,";
        echo ".layout[data-layout=\"{$layout}\"] .acf-fc-layout-handle::before {";
        echo "  content: '';";
        echo "  display: inline-block;";
        echo "  width: 20px;";
        echo "  height: 20px;";
        echo "  margin-right: 8px;";
        echo "  vertical-align: middle;";
        echo "  background: url(\"data:image/svg+xml,{$svg}\") no-repeat center / contain;";
        echo '}';
    }
    // Style global pour aligner les icônes dans les handles
    echo '.acf-fc-layout-handle { display: flex; align-items: center; }';
    echo '.acf-fc-popup a { display: flex; align-items: center; }';
    echo '</style>';
});

// Supprime l'éditeur classique pour les types qui utilisent le flexible content ACF
add_action('init', function(): void {
    remove_post_type_support('page', 'editor');
    remove_post_type_support('project', 'editor');
});


/**
 * Register ACF Field Groups for Flowbite Blocks
 * These fields are exposed via WPGraphQL for ACF to the Astro frontend.
 */
add_action('acf/include_fields', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    // =========================================================================
    // FLEXIBLE CONTENT - Main field group attached to Pages
    // =========================================================================
    acf_add_local_field_group([
        'key' => 'group_flowbite_blocks',
        'title' => 'Flowbite Blocks',
        'fields' => [
            [
                'key' => 'field_flowbite_flexible',
                'label' => 'Contenu flexible',
                'name' => 'flexible_content',
                'type' => 'flexible_content',
                'layouts' => [

                    // ---------------------------------------------------------
                    // 1. HERO SECTION
                    // ---------------------------------------------------------
                    'layout_fb_hero' => [
                        'key' => 'layout_fb_hero',
                        'name' => 'fb_hero_section',
                        'label' => 'Hero Section',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_hero_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_hero_heading',
                                'label' => 'Titre principal',
                                'name' => 'heading',
                                'type' => 'text',
                                'required' => 1,
                            ],
                            [
                                'key' => 'field_fb_hero_highlight',
                                'label' => 'Mot accentué',
                                'name' => 'highlight',
                                'type' => 'text',
                                'instructions' => 'Mot ou phrase mis en valeur dans le titre (couleur accent).',
                            ],
                            [
                                'key' => 'field_fb_hero_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 3,
                            ],
                            [
                                'key' => 'field_fb_hero_image',
                                'label' => 'Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'array',
                            ],
                            [
                                'key' => 'field_fb_hero_cta_text',
                                'label' => 'Texte du bouton principal',
                                'name' => 'cta_text',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_hero_cta_url',
                                'label' => 'Lien du bouton principal',
                                'name' => 'cta_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_hero_cta2_text',
                                'label' => 'Texte du bouton secondaire',
                                'name' => 'cta2_text',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_hero_cta2_url',
                                'label' => 'Lien du bouton secondaire',
                                'name' => 'cta2_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_hero_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'centered' => '1. Centré',
                                    'image_right' => '2. Image à droite',
                                    'image_left' => '3. Image à gauche',
                                    'fullscreen' => '4. Plein écran avec fond',
                                    'video' => '5. Vidéo + texte',
                                    'cover_split' => '6. Image latérale + détails',
                                ],
                                'default_value' => 'centered',
                            ],
                            [
                                'key' => 'field_fb_hero_badge',
                                'label' => 'Badge d\'annonce',
                                'name' => 'badge',
                                'type' => 'text',
                                'instructions' => 'Texte affiché dans un badge au-dessus du titre (ex: « Nouveau », « Offre spéciale »). Laisser vide pour masquer.',
                            ],
                            [
                                'key' => 'field_fb_hero_video_url',
                                'label' => 'URL de la vidéo',
                                'name' => 'video_url',
                                'type' => 'url',
                                'instructions' => 'URL YouTube ou Vimeo (variante 5).',
                                'conditional_logic' => [
                                    [
                                        [
                                            'field' => 'field_fb_hero_variant',
                                            'operator' => '==',
                                            'value' => 'video',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 2. FEATURES SECTION
                    // ---------------------------------------------------------
                    'layout_fb_features' => [
                        'key' => 'layout_fb_features',
                        'name' => 'fb_features_section',
                        'label' => 'Section Fonctionnalités',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_features_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key'               => 'field_fb_features_variant',
                                'label'             => 'Variante d\'affichage',
                                'name'              => 'variant',
                                'type'              => 'select',
                                'choices'           => [
                                    'default'            => '1. Grille avec icônes',
                                    'image_right'        => '2. Image à droite + liste',
                                    'image_left'         => '3. Image à gauche + liste',
                                    'with_ctas'          => '4. Fonctionnalités avec liens',
                                    'checklist'          => '5. Icônes + listes à coches',
                                    'icons_cta'          => '6. Grandes icônes + CTA',
                                    'split_description'  => '7. Description + grille',
                                    'cards'              => '8. Cartes avec bordures',
                                    'alternating'        => '9. Image/texte alternés',
                                    'rounded_icons'      => '10. Icônes rondes colorées',
                                    'centered'           => '11. Grille centrée',
                                    'numbered'           => '12. Étapes numérotées',
                                    'two_col_large'      => '13. 2 colonnes grand format',
                                    'dark'               => '14. Fond sombre',
                                    'horizontal'         => '15. Icône + texte en ligne',
                                    'icon_cards'         => '16. Cartes avec icône proéminente',
                                ],
                                'default_value'     => 'default',
                                'instructions'      => 'Style d\'affichage de la section (voir flowbite.com/blocks/marketing/feature/).',
                                'wrapper'           => ['width' => '35'],
                            ],
                            [
                                'key' => 'field_fb_features_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_features_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_features_image',
                                'label' => 'Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'array',
                                'preview_size' => 'medium',
                                'instructions' => 'Image utilisée dans les variantes avec image (2, 3, 9).',
                                'conditional_logic' => [
                                    [
                                        [
                                            'field' => 'field_fb_features_variant',
                                            'operator' => '==',
                                            'value' => 'image_right',
                                        ],
                                    ],
                                    [
                                        [
                                            'field' => 'field_fb_features_variant',
                                            'operator' => '==',
                                            'value' => 'image_left',
                                        ],
                                    ],
                                    [
                                        [
                                            'field' => 'field_fb_features_variant',
                                            'operator' => '==',
                                            'value' => 'alternating',
                                        ],
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_features_cta_text',
                                'label' => 'Texte du bouton',
                                'name' => 'cta_text',
                                'type' => 'text',
                                'instructions' => 'Bouton CTA (variantes 4, 6).',
                            ],
                            [
                                'key' => 'field_fb_features_cta_url',
                                'label' => 'Lien du bouton',
                                'name' => 'cta_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_features_items',
                                'label' => 'Fonctionnalités',
                                'name' => 'items',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 12,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_feature_icon',
                                        'label' => 'Image / Icône',
                                        'name' => 'image',
                                        'type' => 'image',
                                        'return_format' => 'id',
                                        'preview_size' => 'thumbnail',
                                        'instructions' => 'Image ou icône pour cette fonctionnalité.',
                                    ],
                                    [
                                        'key' => 'field_fb_feature_title',
                                        'label' => 'Titre',
                                        'name' => 'title',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_feature_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ],
                                    [
                                        'key' => 'field_fb_feature_link',
                                        'label' => 'Lien',
                                        'name' => 'link',
                                        'type' => 'url',
                                        'instructions' => 'URL optionnelle (variante 4 : « En savoir plus »).',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_features_columns',
                                'label' => 'Colonnes',
                                'name' => 'columns',
                                'type' => 'select',
                                'choices' => [
                                    '2' => '2 colonnes',
                                    '3' => '3 colonnes',
                                    '4' => '4 colonnes',
                                ],
                                'default_value' => '3',
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 3. CTA SECTION
                    // ---------------------------------------------------------
                    'layout_fb_cta' => [
                        'key' => 'layout_fb_cta',
                        'name' => 'fb_cta_section',
                        'label' => 'Appel à l\'action (CTA)',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_cta_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_cta_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                                'required' => 1,
                            ],
                            [
                                'key' => 'field_fb_cta_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 3,
                            ],
                            [
                                'key' => 'field_fb_cta_button_text',
                                'label' => 'Texte du bouton',
                                'name' => 'button_text',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_cta_button_url',
                                'label' => 'Lien du bouton',
                                'name' => 'button_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_cta_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'default'       => 'Par défaut (deux boutons)',
                                    'with_image'    => 'Avec image',
                                    'centered'      => 'Centré minimal',
                                    'qr_code'       => 'QR Code',
                                    'icon_cards'    => 'Cartes avec icônes',
                                    'table_cta'     => 'Tableau de données',
                                    'newsletter'    => 'Inscription newsletter',
                                    'app_download'  => 'Téléchargement app',
                                    'image_cards'   => 'Cartes avec images',
                                    'tabs_mobile'   => 'Onglets avec aperçu mobile',
                                    'dark'          => 'Fond sombre',
                                ],
                                'default_value' => 'centered',
                            ],
                            // Bouton secondaire (default, app_download)
                            [
                                'key' => 'field_fb_cta_button2_text',
                                'label' => 'Texte du bouton secondaire',
                                'name' => 'button2_text',
                                'type' => 'text',
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'default']],
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'app_download']],
                                ],
                            ],
                            [
                                'key' => 'field_fb_cta_button2_url',
                                'label' => 'Lien du bouton secondaire',
                                'name' => 'button2_url',
                                'type' => 'url',
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'default']],
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'app_download']],
                                ],
                            ],
                            // Image (with_image, qr_code, app_download, tabs_mobile)
                            [
                                'key' => 'field_fb_cta_image',
                                'label' => 'Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'array',
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'with_image']],
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'qr_code']],
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'app_download']],
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'tabs_mobile']],
                                ],
                            ],
                            // Icon items repeater (icon_cards)
                            [
                                'key' => 'field_fb_cta_icon_items',
                                'label' => 'Cartes',
                                'name' => 'icon_items',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 8,
                                'layout' => 'block',
                                'button_label' => 'Ajouter une carte',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'icon_cards']],
                                ],
                                'sub_fields' => [
                                    ['key' => 'field_fb_cta_icon_item_icon', 'label' => 'Icône', 'name' => 'icon', 'type' => 'text', 'instructions' => 'Nom de l\'icône (ex: chart, star, heart)'],
                                    ['key' => 'field_fb_cta_icon_item_title', 'label' => 'Titre', 'name' => 'title', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_icon_item_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 2],
                                    ['key' => 'field_fb_cta_icon_item_link', 'label' => 'Lien', 'name' => 'link', 'type' => 'url'],
                                ],
                            ],
                            // Table rows repeater (table_cta)
                            [
                                'key' => 'field_fb_cta_table_rows',
                                'label' => 'Lignes du tableau',
                                'name' => 'table_rows',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 20,
                                'layout' => 'table',
                                'button_label' => 'Ajouter une ligne',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'table_cta']],
                                ],
                                'sub_fields' => [
                                    ['key' => 'field_fb_cta_table_label', 'label' => 'Libellé', 'name' => 'label', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_table_value', 'label' => 'Valeur', 'name' => 'value', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_table_change', 'label' => 'Variation', 'name' => 'change', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_table_btn_text', 'label' => 'Bouton', 'name' => 'button_text', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_table_btn_url', 'label' => 'Lien', 'name' => 'button_url', 'type' => 'url'],
                                ],
                            ],
                            // Newsletter fields
                            [
                                'key' => 'field_fb_cta_form_action',
                                'label' => 'URL du formulaire',
                                'name' => 'form_action',
                                'type' => 'url',
                                'instructions' => 'URL d\'action du formulaire d\'inscription.',
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'newsletter']],
                                ],
                            ],
                            [
                                'key' => 'field_fb_cta_placeholder',
                                'label' => 'Placeholder',
                                'name' => 'placeholder',
                                'type' => 'text',
                                'default_value' => 'Votre adresse email',
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'newsletter']],
                                ],
                            ],
                            [
                                'key' => 'field_fb_cta_privacy_text',
                                'label' => 'Texte de confidentialité',
                                'name' => 'privacy_text',
                                'type' => 'textarea',
                                'rows' => 2,
                                'instructions' => 'Texte sous le formulaire (HTML autorisé).',
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'newsletter']],
                                ],
                            ],
                            // Image cards repeater (image_cards)
                            [
                                'key' => 'field_fb_cta_cards',
                                'label' => 'Cartes',
                                'name' => 'cards',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 4,
                                'layout' => 'block',
                                'button_label' => 'Ajouter une carte',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'image_cards']],
                                ],
                                'sub_fields' => [
                                    ['key' => 'field_fb_cta_card_image', 'label' => 'Image', 'name' => 'image', 'type' => 'image', 'return_format' => 'array'],
                                    ['key' => 'field_fb_cta_card_title', 'label' => 'Titre', 'name' => 'title', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_card_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 2],
                                    ['key' => 'field_fb_cta_card_value', 'label' => 'Valeur mise en avant', 'name' => 'value', 'type' => 'text', 'instructions' => 'Ex: 2 500 €, 85%, etc.'],
                                    ['key' => 'field_fb_cta_card_btn_text', 'label' => 'Texte du bouton', 'name' => 'button_text', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_card_btn_url', 'label' => 'Lien du bouton', 'name' => 'button_url', 'type' => 'url'],
                                ],
                            ],
                            // Tabs repeater (tabs_mobile)
                            [
                                'key' => 'field_fb_cta_tabs',
                                'label' => 'Onglets',
                                'name' => 'tabs',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 5,
                                'layout' => 'block',
                                'button_label' => 'Ajouter un onglet',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [['field' => 'field_fb_cta_variant', 'operator' => '==', 'value' => 'tabs_mobile']],
                                ],
                                'sub_fields' => [
                                    ['key' => 'field_fb_cta_tab_label', 'label' => 'Titre de l\'onglet', 'name' => 'label', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_tab_desc', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea', 'rows' => 2],
                                    ['key' => 'field_fb_cta_tab_btn_text', 'label' => 'Texte du bouton', 'name' => 'button_text', 'type' => 'text'],
                                    ['key' => 'field_fb_cta_tab_btn_url', 'label' => 'Lien du bouton', 'name' => 'button_url', 'type' => 'url'],
                                    ['key' => 'field_fb_cta_tab_features', 'label' => 'Fonctionnalités', 'name' => 'features', 'type' => 'textarea', 'rows' => 4, 'instructions' => 'Une fonctionnalité par ligne.'],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 4. CONTENT SECTION
                    // ---------------------------------------------------------
                    'layout_fb_content' => [
                        'key' => 'layout_fb_content',
                        'name' => 'fb_content_section',
                        'label' => 'Section Contenu',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_content_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_content_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_content_body',
                                'label' => 'Contenu',
                                'name' => 'body',
                                'type' => 'wysiwyg',
                                'media_upload' => 1,
                            ],
                            [
                                'key' => 'field_fb_content_image',
                                'label' => 'Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'array',
                            ],
                            [
                                'key' => 'field_fb_content_layout',
                                'label' => 'Disposition',
                                'name' => 'layout',
                                'type' => 'select',
                                'choices' => [
                                    'text_only'     => 'Texte seul',
                                    'image_right'   => 'Image à droite',
                                    'image_left'    => 'Image à gauche',
                                    'video'         => 'Vidéo intégrée',
                                    'gallery'       => 'Galerie d\'images',
                                    'two_columns'   => 'Deux colonnes',
                                    'social_proof'  => 'Chiffres clés',
                                    'cards'         => 'Cartes avec images',
                                    'features_list' => 'Liste de caractéristiques',
                                ],
                                'default_value' => 'text_only',
                            ],
                            [
                                'key' => 'field_fb_content_video_url',
                                'label' => 'URL de la vidéo',
                                'name' => 'video_url',
                                'type' => 'url',
                                'instructions' => 'URL YouTube ou Vimeo.',
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'video' ]],
                                ],
                            ],
                            [
                                'key' => 'field_fb_content_images',
                                'label' => 'Galerie d\'images',
                                'name' => 'images',
                                'type' => 'gallery',
                                'return_format' => 'array',
                                'min' => 1,
                                'max' => 12,
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'gallery' ]],
                                ],
                            ],
                            [
                                'key' => 'field_fb_content_body_right',
                                'label' => 'Contenu colonne droite',
                                'name' => 'body_right',
                                'type' => 'wysiwyg',
                                'media_upload' => 1,
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'two_columns' ]],
                                ],
                            ],
                            [
                                'key' => 'field_fb_content_stats',
                                'label' => 'Chiffres clés',
                                'name' => 'content_stats',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 6,
                                'layout' => 'table',
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'social_proof' ]],
                                ],
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_content_stat_value',
                                        'label' => 'Valeur',
                                        'name' => 'value',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_content_stat_label',
                                        'label' => 'Libellé',
                                        'name' => 'label',
                                        'type' => 'text',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_content_cards',
                                'label' => 'Cartes',
                                'name' => 'content_cards',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 6,
                                'layout' => 'block',
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'cards' ]],
                                ],
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_content_card_image',
                                        'label' => 'Image',
                                        'name' => 'image',
                                        'type' => 'image',
                                        'return_format' => 'array',
                                    ],
                                    [
                                        'key' => 'field_fb_content_card_title',
                                        'label' => 'Titre',
                                        'name' => 'title',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_content_card_description',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_content_features',
                                'label' => 'Caractéristiques',
                                'name' => 'content_features',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 12,
                                'layout' => 'table',
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'features_list' ]],
                                ],
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_content_feature_text',
                                        'label' => 'Texte',
                                        'name' => 'text',
                                        'type' => 'text',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_content_cta_text',
                                'label' => 'Texte du bouton',
                                'name' => 'cta_text',
                                'type' => 'text',
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'cards' ]],
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'features_list' ]],
                                ],
                            ],
                            [
                                'key' => 'field_fb_content_cta_url',
                                'label' => 'URL du bouton',
                                'name' => 'cta_url',
                                'type' => 'url',
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'cards' ]],
                                    [[ 'field' => 'field_fb_content_layout', 'operator' => '==', 'value' => 'features_list' ]],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 5. TESTIMONIALS SECTION
                    // ---------------------------------------------------------
                    'layout_fb_testimonials' => [
                        'key' => 'layout_fb_testimonials',
                        'name' => 'fb_testimonials_section',
                        'label' => 'Témoignages',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_testimonials_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key'               => 'field_fb_testimonials_variant',
                                'label'             => 'Variante',
                                'name'              => 'variant',
                                'type'              => 'select',
                                'choices'           => [
                                    'grid'          => 'Grille (3 colonnes)',
                                    'blockquote'    => 'Citation unique',
                                    'cards'         => 'Cartes (2 colonnes)',
                                    'tabs'          => 'Onglets',
                                    'carousel'      => 'Carrousel',
                                ],
                                'default_value'     => 'grid',
                                'instructions'      => 'Style d\'affichage des témoignages.',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_testimonials_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_testimonials_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                                'instructions' => 'Sous-titre optionnel.',
                                'show_in_graphql' => 1,
                            ],
                            [
                                'key' => 'field_fb_testimonials_items',
                                'label' => 'Témoignages',
                                'name' => 'testimonials',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 12,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_testimonial_quote',
                                        'label' => 'Citation',
                                        'name' => 'quote',
                                        'type' => 'textarea',
                                        'rows' => 3,
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_testimonial_author',
                                        'label' => 'Auteur',
                                        'name' => 'author',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_testimonial_role',
                                        'label' => 'Rôle / Fonction',
                                        'name' => 'role',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_testimonial_avatar',
                                        'label' => 'Photo',
                                        'name' => 'avatar',
                                        'type' => 'image',
                                        'return_format' => 'array',
                                    ],
                                    [
                                        'key' => 'field_fb_testimonial_rating',
                                        'label' => 'Note (étoiles)',
                                        'name' => 'rating',
                                        'type' => 'number',
                                        'min' => 0,
                                        'max' => 5,
                                        'default_value' => 5,
                                    ],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 6. PRICING SECTION
                    // ---------------------------------------------------------
                    'layout_fb_pricing' => [
                        'key' => 'layout_fb_pricing',
                        'name' => 'fb_pricing_section',
                        'label' => 'Tarifs',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_pricing_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_pricing_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_pricing_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_pricing_plans',
                                'label' => 'Plans',
                                'name' => 'plans',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 4,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_plan_name',
                                        'label' => 'Nom du plan',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_plan_price',
                                        'label' => 'Prix',
                                        'name' => 'price',
                                        'type' => 'text',
                                        'required' => 1,
                                        'instructions' => 'Ex: 29€, Gratuit, Sur devis',
                                    ],
                                    [
                                        'key' => 'field_fb_plan_period',
                                        'label' => 'Période',
                                        'name' => 'period',
                                        'type' => 'text',
                                        'instructions' => 'Ex: /mois, /an, /séance',
                                    ],
                                    [
                                        'key' => 'field_fb_plan_description',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ],
                                    [
                                        'key' => 'field_fb_plan_features',
                                        'label' => 'Caractéristiques',
                                        'name' => 'features',
                                        'type' => 'repeater',
                                        'min' => 1,
                                        'layout' => 'table',
                                        'sub_fields' => [
                                            [
                                                'key' => 'field_fb_plan_feature_text',
                                                'label' => 'Texte',
                                                'name' => 'text',
                                                'type' => 'text',
                                            ],
                                            [
                                                'key' => 'field_fb_plan_feature_included',
                                                'label' => 'Inclus',
                                                'name' => 'included',
                                                'type' => 'true_false',
                                                'default_value' => 1,
                                            ],
                                        ],
                                    ],
                                    [
                                        'key' => 'field_fb_plan_cta_text',
                                        'label' => 'Texte du bouton',
                                        'name' => 'cta_text',
                                        'type' => 'text',
                                        'default_value' => 'Choisir',
                                    ],
                                    [
                                        'key' => 'field_fb_plan_cta_url',
                                        'label' => 'Lien du bouton',
                                        'name' => 'cta_url',
                                        'type' => 'url',
                                    ],
                                    [
                                        'key' => 'field_fb_plan_highlighted',
                                        'label' => 'Mis en avant',
                                        'name' => 'highlighted',
                                        'type' => 'true_false',
                                        'default_value' => 0,
                                    ],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 7. FAQ SECTION
                    // ---------------------------------------------------------
                    'layout_fb_faq' => [
                        'key' => 'layout_fb_faq',
                        'name' => 'fb_faq_section',
                        'label' => 'FAQ (Questions fréquentes)',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_faq_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key'               => 'field_fb_faq_variant',
                                'label'             => 'Variante',
                                'name'              => 'variant',
                                'type'              => 'select',
                                'choices'           => [
                                    'default'           => 'Grille 2 colonnes (icônes)',
                                    'search_links'      => 'Barre de recherche + liens',
                                    'side_description'  => 'Description à gauche',
                                    'accordion'         => 'Accordéon',
                                    'three_columns'     => 'Grille 3 colonnes',
                                    'help_center'       => 'Centre d\'aide (cartes)',
                                    'cards'             => 'Cartes',
                                ],
                                'default_value'     => 'accordion',
                                'instructions'      => 'Style d\'affichage de la section FAQ.',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_faq_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_faq_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_faq_items',
                                'label' => 'Questions',
                                'name' => 'faqs',
                                'type' => 'repeater',
                                'min' => 1,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_faq_question',
                                        'label' => 'Question',
                                        'name' => 'question',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_faq_answer',
                                        'label' => 'Réponse',
                                        'name' => 'answer',
                                        'type' => 'wysiwyg',
                                        'media_upload' => 0,
                                    ],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 8. TEAM SECTION
                    // ---------------------------------------------------------
                    'layout_fb_team' => [
                        'key' => 'layout_fb_team',
                        'name' => 'fb_team_section',
                        'label' => 'Équipe',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_team_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key'               => 'field_fb_team_variant',
                                'label'             => 'Variante',
                                'name'              => 'variant',
                                'type'              => 'select',
                                'choices'           => [
                                    'default'       => 'Cards horizontales',
                                    'grid'          => 'Grille avatars ronds',
                                ],
                                'default_value'     => 'default',
                                'instructions'      => 'Style d\'affichage de la section équipe.',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_team_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_team_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_team_members',
                                'label' => 'Membres',
                                'name' => 'members',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 12,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_member_name',
                                        'label' => 'Nom',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_member_role',
                                        'label' => 'Fonction',
                                        'name' => 'role',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_member_bio',
                                        'label' => 'Bio',
                                        'name' => 'bio',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ],
                                    [
                                        'key' => 'field_fb_member_photo',
                                        'label' => 'Photo',
                                        'name' => 'photo',
                                        'type' => 'image',
                                        'return_format' => 'array',
                                    ],
                                    [
                                        'key' => 'field_fb_member_social',
                                        'label' => 'Réseaux sociaux',
                                        'name' => 'social',
                                        'type' => 'group',
                                        'sub_fields' => [
                                            [
                                                'key' => 'field_fb_member_linkedin',
                                                'label' => 'LinkedIn',
                                                'name' => 'linkedin',
                                                'type' => 'url',
                                            ],
                                            [
                                                'key' => 'field_fb_member_twitter',
                                                'label' => 'Twitter/X',
                                                'name' => 'twitter',
                                                'type' => 'url',
                                            ],
                                            [
                                                'key' => 'field_fb_member_email',
                                                'label' => 'Email',
                                                'name' => 'email',
                                                'type' => 'email',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 9. CONTACT SECTION
                    // ---------------------------------------------------------
                    'layout_fb_contact' => [
                        'key' => 'layout_fb_contact',
                        'name' => 'fb_contact_section',
                        'label' => 'Contact',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_contact_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_contact_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_contact_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_contact_email',
                                'label' => 'Email de contact',
                                'name' => 'email',
                                'type' => 'email',
                            ],
                            [
                                'key' => 'field_fb_contact_phone',
                                'label' => 'Téléphone',
                                'name' => 'phone',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_contact_address',
                                'label' => 'Adresse',
                                'name' => 'address',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_contact_form_action',
                                'label' => 'URL action du formulaire',
                                'name' => 'form_action',
                                'type' => 'url',
                                'instructions' => 'URL vers laquelle le formulaire sera soumis (ex: Formspree, Netlify Forms).',
                            ],
                            [
                                'key' => 'field_fb_contact_show_map',
                                'label' => 'Afficher la carte',
                                'name' => 'show_map',
                                'type' => 'true_false',
                                'default_value' => 0,
                            ],
                            [
                                'key' => 'field_fb_contact_map_embed',
                                'label' => 'Code embed Google Maps',
                                'name' => 'map_embed',
                                'type' => 'textarea',
                                'rows' => 2,
                                'instructions' => 'Collez le code iframe Google Maps.',
                                'conditional_logic' => [
                                    [
                                        [
                                            'field' => 'field_fb_contact_show_map',
                                            'operator' => '==',
                                            'value' => '1',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 10. NEWSLETTER SECTION
                    // ---------------------------------------------------------
                    'layout_fb_newsletter' => [
                        'key' => 'layout_fb_newsletter',
                        'name' => 'fb_newsletter_section',
                        'label' => 'Newsletter',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_newsletter_variant',
                                'label'             => 'Variante',
                                'name'              => 'variant',
                                'type'              => 'select',
                                'choices'           => [
                                    'default'   => 'Par défaut',
                                    'card'      => 'Carte',
                                    'banner'    => 'Bandeau',
                                    'popup'     => 'Popup',
                                    'modal'     => 'Modale avec image',
                                ],
                                'default_value'     => 'default',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '35'],
                            ],
                            [
                                'key'               => 'field_fb_newsletter_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_newsletter_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_newsletter_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_newsletter_form_action',
                                'label' => 'URL du formulaire',
                                'name' => 'form_action',
                                'type' => 'url',
                                'instructions' => 'URL de soumission (Mailchimp, Sendinblue, etc.)',
                            ],
                            [
                                'key' => 'field_fb_newsletter_placeholder',
                                'label' => 'Placeholder email',
                                'name' => 'placeholder',
                                'type' => 'text',
                                'default_value' => 'Votre adresse email',
                            ],
                            [
                                'key' => 'field_fb_newsletter_button_text',
                                'label' => 'Texte du bouton',
                                'name' => 'button_text',
                                'type' => 'text',
                                'default_value' => "S'inscrire",
                            ],
                            [
                                'key' => 'field_fb_newsletter_privacy_text',
                                'label' => 'Texte RGPD',
                                'name' => 'privacy_text',
                                'type' => 'textarea',
                                'rows' => 2,
                                'instructions' => 'Texte relatif à la politique de confidentialité.',
                            ],
                            [
                                'key' => 'field_fb_newsletter_image',
                                'label' => 'Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'id',
                                'preview_size' => 'medium',
                                'instructions' => 'Image affichée dans la variante Modale.',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [
                                        [
                                            'field' => 'field_fb_newsletter_variant',
                                            'operator' => '==',
                                            'value' => 'modal',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 11. STATS / CHIFFRES CLÉS
                    // ---------------------------------------------------------
                    'layout_fb_stats' => [
                        'key' => 'layout_fb_stats',
                        'name' => 'fb_stats_section',
                        'label' => 'Chiffres clés',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_stats_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_stats_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_stats_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_stats_items',
                                'label' => 'Statistiques',
                                'name' => 'stats',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 8,
                                'layout' => 'table',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_stat_value',
                                        'label' => 'Valeur',
                                        'name' => 'value',
                                        'type' => 'text',
                                        'required' => 1,
                                        'instructions' => 'Ex: 150+, 99%, 10k',
                                    ],
                                    [
                                        'key' => 'field_fb_stat_label',
                                        'label' => 'Libellé',
                                        'name' => 'label',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_stat_description',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'text',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_stats_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'light' => 'Fond clair',
                                    'dark' => 'Fond sombre',
                                    'accent' => 'Fond accent',
                                ],
                                'default_value' => 'light',
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 12. GALLERY SECTION (enhanced)
                    // ---------------------------------------------------------
                    'layout_fb_gallery' => [
                        'key' => 'layout_fb_gallery',
                        'name' => 'fb_gallery_section',
                        'label' => 'Galerie d\'images',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_gallery_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_gallery_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_gallery_images',
                                'label' => 'Images',
                                'name' => 'images',
                                'type' => 'gallery',
                                'return_format' => 'array',
                                'min' => 1,
                            ],
                            [
                                'key' => 'field_fb_gallery_columns',
                                'label' => 'Colonnes',
                                'name' => 'columns',
                                'type' => 'select',
                                'choices' => [
                                    '2' => '2 colonnes',
                                    '3' => '3 colonnes',
                                    '4' => '4 colonnes',
                                ],
                                'default_value' => '3',
                            ],
                            [
                                'key' => 'field_fb_gallery_style',
                                'label' => 'Style',
                                'name' => 'style',
                                'type' => 'select',
                                'choices' => [
                                    'grid' => 'Grille',
                                    'masonry' => 'Masonry',
                                ],
                                'default_value' => 'grid',
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 13. SOCIAL PROOF
                    // ---------------------------------------------------------
                    'layout_fb_social_proof' => [
                        'key' => 'layout_fb_social_proof',
                        'name' => 'fb_social_proof_section',
                        'label' => 'Preuve sociale',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_social_proof_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_sp_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_sp_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_sp_items',
                                'label' => 'Éléments',
                                'name' => 'proofs',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 8,
                                'layout' => 'table',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_sp_value',
                                        'label' => 'Valeur',
                                        'name' => 'value',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_sp_label',
                                        'label' => 'Libellé',
                                        'name' => 'label',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_sp_desc',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'text',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_sp_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'cards' => 'Cartes',
                                    'inline' => 'En ligne',
                                    'with_background' => 'Avec fond sombre',
                                    'illustration' => 'Illustration + stats',
                                    'carousel' => 'Carrousel + stats',
                                    'icons_cta' => 'Icônes + CTA',
                                ],
                                'default_value' => 'cards',
                            ],
                            [
                                'key' => 'field_fb_sp_image',
                                'label' => 'Image / Illustration',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'array',
                                'preview_size' => 'medium',
                                'instructions' => 'Image affichée à côté des statistiques (variante Illustration).',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_sp_variant', 'operator' => '==', 'value' => 'illustration' ]],
                                ],
                            ],
                            [
                                'key' => 'field_fb_sp_images',
                                'label' => 'Images du carrousel',
                                'name' => 'images',
                                'type' => 'gallery',
                                'return_format' => 'array',
                                'preview_size' => 'medium',
                                'instructions' => 'Images pour le carrousel (variante Carrousel).',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_sp_variant', 'operator' => '==', 'value' => 'carousel' ]],
                                ],
                            ],
                            [
                                'key' => 'field_fb_sp_subtitle',
                                'label' => 'Sur-titre',
                                'name' => 'subtitle',
                                'type' => 'text',
                                'instructions' => 'Petit texte au-dessus du titre (variante Icônes + CTA).',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_sp_variant', 'operator' => '==', 'value' => 'icons_cta' ]],
                                ],
                            ],
                            [
                                'key' => 'field_fb_sp_cta_text',
                                'label' => 'Texte du bouton',
                                'name' => 'ctaText',
                                'type' => 'text',
                                'instructions' => 'Texte du lien CTA (variante Icônes + CTA).',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_sp_variant', 'operator' => '==', 'value' => 'icons_cta' ]],
                                ],
                            ],
                            [
                                'key' => 'field_fb_sp_cta_url',
                                'label' => 'URL du bouton',
                                'name' => 'ctaUrl',
                                'type' => 'url',
                                'instructions' => 'URL du lien CTA (variante Icônes + CTA).',
                                'show_in_graphql' => 1,
                                'conditional_logic' => [
                                    [[ 'field' => 'field_fb_sp_variant', 'operator' => '==', 'value' => 'icons_cta' ]],
                                ],
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 14. LOGOS CLIENTS
                    // ---------------------------------------------------------
                    'layout_fb_logos' => [
                        'key' => 'layout_fb_logos',
                        'name' => 'fb_customer_logos_section',
                        'label' => 'Logos partenaires / clients',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_logos_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_logos_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_logos_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_logos_items',
                                'label' => 'Logos',
                                'name' => 'logos',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 20,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_logo_name',
                                        'label' => 'Nom',
                                        'name' => 'name',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_logo_image',
                                        'label' => 'Logo',
                                        'name' => 'image',
                                        'type' => 'image',
                                        'return_format' => 'array',
                                    ],
                                    [
                                        'key' => 'field_fb_logo_url',
                                        'label' => 'Lien',
                                        'name' => 'url',
                                        'type' => 'url',
                                    ],
                                    [
                                        'key' => 'field_fb_logo_since',
                                        'label' => 'Client depuis',
                                        'name' => 'since',
                                        'type' => 'text',
                                        'instructions' => 'Ex : 2016. Affiché uniquement avec la variante "Cartes".',
                                        'conditional_logic' => [
                                            [
                                                [
                                                    'field' => 'field_fb_logos_variant',
                                                    'operator' => '==',
                                                    'value' => 'cards',
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_logos_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'grid' => 'Grille',
                                    'banner' => 'Bandeau',
                                    'with_cta' => 'Avec texte à gauche',
                                    'cards' => 'Cartes avec description',
                                ],
                                'default_value' => 'grid',
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 15. BLOG SECTIONS
                    // ---------------------------------------------------------
                    'layout_fb_blog' => [
                        'key' => 'layout_fb_blog',
                        'name' => 'fb_blog_section',
                        'label' => 'Section Blog',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_blog_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_blog_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_blog_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_blog_posts',
                                'label' => 'Articles',
                                'name' => 'posts',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 12,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_blog_post_title',
                                        'label' => 'Titre',
                                        'name' => 'title',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_blog_post_excerpt',
                                        'label' => 'Extrait',
                                        'name' => 'excerpt',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ],
                                    [
                                        'key' => 'field_fb_blog_post_image',
                                        'label' => 'Image',
                                        'name' => 'image',
                                        'type' => 'image',
                                        'return_format' => 'array',
                                    ],
                                    [
                                        'key' => 'field_fb_blog_post_url',
                                        'label' => 'Lien',
                                        'name' => 'url',
                                        'type' => 'url',
                                    ],
                                    [
                                        'key' => 'field_fb_blog_post_category',
                                        'label' => 'Catégorie',
                                        'name' => 'category',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_blog_post_author',
                                        'label' => 'Auteur',
                                        'name' => 'author',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_blog_post_avatar',
                                        'label' => 'Avatar auteur',
                                        'name' => 'author_avatar',
                                        'type' => 'image',
                                        'return_format' => 'array',
                                    ],
                                    [
                                        'key' => 'field_fb_blog_post_date',
                                        'label' => 'Date',
                                        'name' => 'date',
                                        'type' => 'text',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_blog_cta_text',
                                'label' => 'Texte du lien "voir tout"',
                                'name' => 'cta_text',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_blog_cta_url',
                                'label' => 'URL du lien "voir tout"',
                                'name' => 'cta_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_blog_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'cards' => 'Cartes',
                                    'list' => 'Liste',
                                    'featured' => 'Article mis en avant',
                                    'centered' => 'Centré',
                                    'cards_image' => 'Cartes avec image',
                                ],
                                'default_value' => 'cards',
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 16. PORTFOLIO
                    // ---------------------------------------------------------
                    'layout_fb_portfolio' => [
                        'key' => 'layout_fb_portfolio',
                        'name' => 'fb_portfolio_section',
                        'label' => 'Portfolio / Projets',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_portfolio_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_portfolio_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_portfolio_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_portfolio_projects',
                                'label' => 'Projets',
                                'name' => 'projects',
                                'type' => 'repeater',
                                'min' => 1,
                                'max' => 12,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_project_title',
                                        'label' => 'Titre',
                                        'name' => 'title',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_project_description',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ],
                                    [
                                        'key' => 'field_fb_project_image',
                                        'label' => 'Image',
                                        'name' => 'image',
                                        'type' => 'image',
                                        'return_format' => 'array',
                                    ],
                                    [
                                        'key' => 'field_fb_project_url',
                                        'label' => 'Lien',
                                        'name' => 'url',
                                        'type' => 'url',
                                    ],
                                    [
                                        'key' => 'field_fb_project_category',
                                        'label' => 'Catégorie',
                                        'name' => 'category',
                                        'type' => 'text',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_portfolio_cta_text',
                                'label' => 'Texte du bouton',
                                'name' => 'cta_text',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_portfolio_cta_url',
                                'label' => 'Lien du bouton',
                                'name' => 'cta_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_portfolio_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'cards' => 'Cartes avec overlay',
                                    'minimal' => 'Minimal',
                                    'masonry' => 'Masonry',
                                ],
                                'default_value' => 'cards',
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 17. BANNER
                    // ---------------------------------------------------------
                    'layout_fb_banner' => [
                        'key' => 'layout_fb_banner',
                        'name' => 'fb_banner_section',
                        'label' => 'Bannière',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_banner_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_banner_text',
                                'label' => 'Texte',
                                'name' => 'text',
                                'type' => 'text',
                                'required' => 1,
                            ],
                            [
                                'key' => 'field_fb_banner_icon',
                                'label' => 'Icône SVG',
                                'name' => 'icon',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_banner_cta_text',
                                'label' => 'Texte du lien',
                                'name' => 'cta_text',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_banner_cta_url',
                                'label' => 'URL du lien',
                                'name' => 'cta_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_banner_dismissible',
                                'label' => 'Peut être fermée',
                                'name' => 'dismissible',
                                'type' => 'true_false',
                                'default_value' => 1,
                            ],
                            [
                                'key' => 'field_fb_banner_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'top' => 'Barre supérieure',
                                    'bottom' => 'Barre inférieure fixe',
                                    'info' => 'Encart info',
                                ],
                                'default_value' => 'top',
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 18. EVENT SCHEDULE
                    // ---------------------------------------------------------
                    'layout_fb_events' => [
                        'key' => 'layout_fb_events',
                        'name' => 'fb_event_schedule_section',
                        'label' => 'Planning / Événements',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_events_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_events_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_events_description',
                                'label' => 'Description',
                                'name' => 'description',
                                'type' => 'textarea',
                                'rows' => 2,
                            ],
                            [
                                'key' => 'field_fb_events_items',
                                'label' => 'Événements',
                                'name' => 'events',
                                'type' => 'repeater',
                                'min' => 1,
                                'layout' => 'block',
                                'sub_fields' => [
                                    [
                                        'key' => 'field_fb_event_title',
                                        'label' => 'Titre',
                                        'name' => 'title',
                                        'type' => 'text',
                                        'required' => 1,
                                    ],
                                    [
                                        'key' => 'field_fb_event_date',
                                        'label' => 'Date',
                                        'name' => 'date',
                                        'type' => 'text',
                                        'instructions' => 'Ex: 15 Mars 2026',
                                    ],
                                    [
                                        'key' => 'field_fb_event_time',
                                        'label' => 'Heure',
                                        'name' => 'time',
                                        'type' => 'text',
                                        'instructions' => 'Ex: 14h00 - 16h00',
                                    ],
                                    [
                                        'key' => 'field_fb_event_description',
                                        'label' => 'Description',
                                        'name' => 'description',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                    ],
                                    [
                                        'key' => 'field_fb_event_location',
                                        'label' => 'Lieu',
                                        'name' => 'location',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_event_cta_text',
                                        'label' => 'Texte du lien',
                                        'name' => 'cta_text',
                                        'type' => 'text',
                                    ],
                                    [
                                        'key' => 'field_fb_event_cta_url',
                                        'label' => 'URL du lien',
                                        'name' => 'cta_url',
                                        'type' => 'url',
                                    ],
                                ],
                            ],
                            [
                                'key' => 'field_fb_events_variant',
                                'label' => 'Variante',
                                'name' => 'variant',
                                'type' => 'select',
                                'choices' => [
                                    'timeline' => 'Timeline',
                                    'cards' => 'Cartes',
                                    'table' => 'Tableau',
                                ],
                                'default_value' => 'timeline',
                            ],
                        ],
                    ],

                    // ---------------------------------------------------------
                    // 19. HERO HOMEPAGE
                    // ---------------------------------------------------------
                    'layout_fb_hero_homepage' => [
                        'key' => 'layout_fb_hero_homepage',
                        'name' => 'fb_hero_homepage',
                        'label' => 'Hero Homepage',
                        'display' => 'block',
                        'sub_fields' => [
                            [
                                'key'               => 'field_fb_hero_homepage_color_variation',
                                'label'             => 'Variation de couleurs',
                                'name'              => 'color_variation',
                                'type'              => 'select',
                                'choices'           => [
                                    ''              => 'Par défaut',
                                    'variation-1'   => 'Variation 1',
                                    'variation-2'   => 'Variation 2',
                                    'variation-3'   => 'Variation 3',
                                ],
                                'default_value'     => '',
                                'instructions'      => 'Combinaison de couleurs (définie dans Réglages du thème → Variations).',
                                'show_in_graphql'   => 1,
                                'wrapper'           => ['width' => '30'],
                            ],
                            [
                                'key' => 'field_fb_hero_hp_heading',
                                'label' => 'Titre principal',
                                'name' => 'heading',
                                'type' => 'text',
                                'instructions' => 'Texte principal (après le highlight)',
                            ],
                            [
                                'key' => 'field_fb_hero_hp_highlight',
                                'label' => 'Texte en surbrillance',
                                'name' => 'highlight',
                                'type' => 'text',
                                'instructions' => 'Partie du titre mise en avant (avant le texte principal)',
                            ],
                            [
                                'key' => 'field_fb_hero_hp_subtitle',
                                'label' => 'Sous-titre',
                                'name' => 'subtitle',
                                'type' => 'text',
                            ],
                            [
                                'key' => 'field_fb_hero_hp_cta_text',
                                'label' => 'Texte lien 1',
                                'name' => 'cta_text',
                                'type' => 'text',
                                'instructions' => 'Lien texte simple (souligné)',
                            ],
                            [
                                'key' => 'field_fb_hero_hp_cta_url',
                                'label' => 'URL lien 1',
                                'name' => 'cta_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_hero_hp_cta2_text',
                                'label' => 'Texte bouton 2',
                                'name' => 'cta2_text',
                                'type' => 'text',
                                'instructions' => 'Bouton principal (avec fond)',
                            ],
                            [
                                'key' => 'field_fb_hero_hp_cta2_url',
                                'label' => 'URL bouton 2',
                                'name' => 'cta2_url',
                                'type' => 'url',
                            ],
                            [
                                'key' => 'field_fb_hero_hp_images',
                                'label' => 'Images (grille masonry)',
                                'name' => 'images',
                                'type' => 'gallery',
                                'return_format' => 'array',
                                'preview_size' => 'medium',
                                'library' => 'all',
                                'min' => 0,
                                'max' => 8,
                                'instructions' => 'Images affichées en grille masonry à droite du hero',
                            ],
                            [
                                'key' => 'field_fb_hero_hp_heart',
                                'label' => 'Animation coeur',
                                'name' => 'show_heart_animation',
                                'type' => 'true_false',
                                'default_value' => 1,
                                'ui' => 1,
                                'instructions' => 'Afficher l\'animation SVG du coeur en arrière-plan',
                            ],
                        ],
                    ],

                ],
                'button_label' => 'Ajouter un bloc',
            ],
        ],
        'location' => [
            // Attach to Pages
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page',
                ],
            ],
            // Attach to Projects (CPT)
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'project',
                ],
            ],
        ],
        'show_in_graphql' => 1,
        'graphql_field_name' => 'acfFields',
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ]);
});

/**
 * Expose ACF image fields properly in GraphQL
 * Ensures image fields return sourceUrl, altText, and mediaDetails
 */
add_filter('graphql_acf_field_value', function ($value, $acf_field, $root, $id) {
    if ($acf_field['type'] === 'image' && is_array($value)) {
        return [
            'sourceUrl' => $value['url'] ?? '',
            'altText' => $value['alt'] ?? '',
            'mediaDetails' => [
                'width' => $value['width'] ?? 0,
                'height' => $value['height'] ?? 0,
            ],
        ];
    }

    if ($acf_field['type'] === 'gallery' && is_array($value)) {
        return array_map(function ($img) {
            if (is_array($img)) {
                return [
                    'sourceUrl' => $img['url'] ?? '',
                    'altText' => $img['alt'] ?? '',
                    'mediaDetails' => [
                        'width' => $img['width'] ?? 0,
                        'height' => $img['height'] ?? 0,
                    ],
                ];
            }
            return $img;
        }, $value);
    }

    return $value;
}, 10, 4);


// =========================================================================
// ACF OPTIONS PAGE — Réglages généraux de l'UI
// =========================================================================

add_action('acf/init', function (): void {
    if (!function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page([
        'page_title'          => 'Réglages du thème',
        'menu_title'          => 'Réglages du thème',
        'menu_slug'           => 'theme-settings',
        'capability'          => 'edit_posts',
        'redirect'            => false,
        'icon_url'            => 'dashicons-admin-customizer',
        'position'            => 2,
        'show_in_graphql'     => true,
        'graphql_field_name'  => 'themeSettingsPage',
    ]);
});

add_action('acf/include_fields', function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key'                   => 'group_theme_settings',
        'title'                 => 'Réglages du thème',
        'fields'                => [

            // ── Mise en page ─────────────────────────────────────
            [
                'key'               => 'field_ts_tab_layout',
                'label'             => 'Mise en page',
                'type'              => 'tab',
            ],
            [
                'key'               => 'field_ts_content_width',
                'label'             => 'Largeur du contenu',
                'name'              => 'content_width',
                'type'              => 'select',
                'choices'           => [
                    'contained'     => 'Contenu (largeur limitée)',
                    'full_width'    => 'Pleine largeur',
                ],
                'default_value'     => 'contained',
                'return_format'     => 'value',
                'instructions'      => 'Définit la largeur par défaut du contenu des pages.',
            ],

            // ── Logo ─────────────────────────────────────────────
            [
                'key'               => 'field_ts_tab_logo',
                'label'             => 'Logo',
                'type'              => 'tab',
            ],
            [
                'key'               => 'field_ts_logo',
                'label'             => 'Logo du site',
                'name'              => 'logo',
                'type'              => 'image',
                'return_format'     => 'array',
                'preview_size'      => 'medium',
                'instructions'      => 'Logo affiché dans le header. Laisser vide pour afficher le titre du site.',
            ],
            [
                'key'               => 'field_ts_logo_footer',
                'label'             => 'Logo du footer',
                'name'              => 'logo_footer',
                'type'              => 'image',
                'return_format'     => 'array',
                'preview_size'      => 'medium',
                'instructions'      => 'Logo alternatif pour le footer. Si vide, le logo principal est utilisé.',
            ],

            // ── Couleurs ─────────────────────────────────────────
            [
                'key'               => 'field_ts_tab_colors',
                'label'             => 'Couleurs',
                'type'              => 'tab',
            ],
            [
                'key'               => 'field_ts_color_beige',
                'label'             => 'Beige (fonds, aplats doux)',
                'name'              => 'color_beige',
                'type'              => 'color_picker',
                'default_value'     => '#E8DCCB',
            ],
            [
                'key'               => 'field_ts_color_creme',
                'label'             => 'Crème (fond principal)',
                'name'              => 'color_creme',
                'type'              => 'color_picker',
                'default_value'     => '#FAF8F5',
            ],
            [
                'key'               => 'field_ts_color_taupe',
                'label'             => 'Taupe (titres, textes importants)',
                'name'              => 'color_taupe',
                'type'              => 'color_picker',
                'default_value'     => '#6B6257',
            ],
            [
                'key'               => 'field_ts_color_sauge',
                'label'             => 'Sauge (boutons, accent primaire)',
                'name'              => 'color_sauge',
                'type'              => 'color_picker',
                'default_value'     => '#A8BFA3',
            ],
            [
                'key'               => 'field_ts_color_mousse',
                'label'             => 'Mousse (accent secondaire)',
                'name'              => 'color_mousse',
                'type'              => 'color_picker',
                'default_value'     => '#7A9575',
            ],

            // ── Variations de couleurs ─────────────────────────────
            [
                'key'               => 'field_ts_tab_variations',
                'label'             => 'Variations de couleurs',
                'type'              => 'tab',
                'instructions'      => 'Définissez 3 combinaisons de couleurs applicables à chaque bloc.',
            ],

            // Variation 1
            [
                'key'               => 'field_ts_variation_1_message',
                'label'             => 'Variation 1',
                'type'              => 'message',
                'message'           => '<strong>Combinaison de couleurs n°1</strong>',
            ],
            [
                'key'               => 'field_ts_variation_1_bg',
                'label'             => 'Variation 1 — Arrière-plan',
                'name'              => 'variation_1_bg',
                'type'              => 'color_picker',
                'default_value'     => '#FAF8F5',
                'instructions'      => 'Couleur de fond de la section.',
            ],
            [
                'key'               => 'field_ts_variation_1_title',
                'label'             => 'Variation 1 — Titre',
                'name'              => 'variation_1_title',
                'type'              => 'color_picker',
                'default_value'     => '#6B6257',
                'instructions'      => 'Couleur des titres (h2, h3…).',
            ],
            [
                'key'               => 'field_ts_variation_1_text',
                'label'             => 'Variation 1 — Texte',
                'name'              => 'variation_1_text',
                'type'              => 'color_picker',
                'default_value'     => '#6B6257',
                'instructions'      => 'Couleur du texte courant.',
            ],

            // Variation 2
            [
                'key'               => 'field_ts_variation_2_message',
                'label'             => 'Variation 2',
                'type'              => 'message',
                'message'           => '<strong>Combinaison de couleurs n°2</strong>',
            ],
            [
                'key'               => 'field_ts_variation_2_bg',
                'label'             => 'Variation 2 — Arrière-plan',
                'name'              => 'variation_2_bg',
                'type'              => 'color_picker',
                'default_value'     => '#E8DCCB',
                'instructions'      => 'Couleur de fond de la section.',
            ],
            [
                'key'               => 'field_ts_variation_2_title',
                'label'             => 'Variation 2 — Titre',
                'name'              => 'variation_2_title',
                'type'              => 'color_picker',
                'default_value'     => '#6B6257',
                'instructions'      => 'Couleur des titres (h2, h3…).',
            ],
            [
                'key'               => 'field_ts_variation_2_text',
                'label'             => 'Variation 2 — Texte',
                'name'              => 'variation_2_text',
                'type'              => 'color_picker',
                'default_value'     => '#6B6257',
                'instructions'      => 'Couleur du texte courant.',
            ],

            // Variation 3
            [
                'key'               => 'field_ts_variation_3_message',
                'label'             => 'Variation 3',
                'type'              => 'message',
                'message'           => '<strong>Combinaison de couleurs n°3</strong>',
            ],
            [
                'key'               => 'field_ts_variation_3_bg',
                'label'             => 'Variation 3 — Arrière-plan',
                'name'              => 'variation_3_bg',
                'type'              => 'color_picker',
                'default_value'     => '#6B6257',
                'instructions'      => 'Couleur de fond de la section.',
            ],
            [
                'key'               => 'field_ts_variation_3_title',
                'label'             => 'Variation 3 — Titre',
                'name'              => 'variation_3_title',
                'type'              => 'color_picker',
                'default_value'     => '#FAF8F5',
                'instructions'      => 'Couleur des titres (h2, h3…).',
            ],
            [
                'key'               => 'field_ts_variation_3_text',
                'label'             => 'Variation 3 — Texte',
                'name'              => 'variation_3_text',
                'type'              => 'color_picker',
                'default_value'     => '#FAF8F5',
                'instructions'      => 'Couleur du texte courant.',
            ],

            // ── Typographie ──────────────────────────────────────
            [
                'key'               => 'field_ts_tab_typo',
                'label'             => 'Typographie',
                'type'              => 'tab',
            ],
            [
                'key'               => 'field_ts_font_body',
                'label'             => 'Police du corps',
                'name'              => 'font_body',
                'type'              => 'text',
                'default_value'     => 'Montserrat',
                'instructions'      => 'Nom Google Fonts exact (ex: Montserrat, Inter, Lato).',
            ],
            [
                'key'               => 'field_ts_font_heading',
                'label'             => 'Police des titres',
                'name'              => 'font_heading',
                'type'              => 'text',
                'default_value'     => 'Libre Baskerville',
                'instructions'      => 'Nom Google Fonts exact (ex: Libre Baskerville, Playfair Display).',
            ],

            // ── Réseaux sociaux ──────────────────────────────────
            [
                'key'               => 'field_ts_tab_social',
                'label'             => 'Réseaux sociaux',
                'type'              => 'tab',
            ],
            [
                'key'               => 'field_ts_social_facebook',
                'label'             => 'Facebook',
                'name'              => 'social_facebook',
                'type'              => 'url',
            ],
            [
                'key'               => 'field_ts_social_instagram',
                'label'             => 'Instagram',
                'name'              => 'social_instagram',
                'type'              => 'url',
            ],
            [
                'key'               => 'field_ts_social_linkedin',
                'label'             => 'LinkedIn',
                'name'              => 'social_linkedin',
                'type'              => 'url',
            ],
            [
                'key'               => 'field_ts_social_tiktok',
                'label'             => 'TikTok',
                'name'              => 'social_tiktok',
                'type'              => 'url',
            ],
            [
                'key'               => 'field_ts_social_youtube',
                'label'             => 'YouTube',
                'name'              => 'social_youtube',
                'type'              => 'url',
            ],

            // ── Navigation ────────────────────────────────────────
            [
                'key'               => 'field_ts_tab_navbar',
                'label'             => 'Navigation',
                'type'              => 'tab',
            ],
            [
                'key'               => 'field_ts_navbar_variant',
                'label'             => 'Style de navigation',
                'name'              => 'navbar_variant',
                'type'              => 'select',
                'choices'           => [
                    'default'       => 'Par défaut (logo + liens)',
                    'with_cta'      => 'Avec bouton CTA',
                    'with_search'   => 'Avec recherche',
                    'centered'      => 'Logo centré',
                    'transparent'   => 'Transparent (pour hero)',
                ],
                'default_value'     => 'default',
                'return_format'     => 'value',
                'instructions'      => 'Choisissez le style de barre de navigation.',
            ],
            [
                'key'               => 'field_ts_navbar_color_scheme',
                'label'             => 'Couleurs de la navigation',
                'name'              => 'navbar_color_scheme',
                'type'              => 'select',
                'choices'           => [
                    'light'         => 'Clair (fond beige, texte taupe)',
                    'dark'          => 'Sombre (fond taupe, texte crème)',
                    'white'         => 'Blanc (fond crème, texte taupe)',
                    'sauge'         => 'Sauge (fond sauge, texte blanc)',
                    'transparent'   => 'Transparent (texte blanc)',
                ],
                'default_value'     => 'light',
                'return_format'     => 'value',
                'instructions'      => 'Palette de couleurs de la barre de navigation.',
            ],
            [
                'key'               => 'field_ts_navbar_sticky',
                'label'             => 'Navigation fixe (sticky)',
                'name'              => 'navbar_sticky',
                'type'              => 'true_false',
                'default_value'     => 1,
                'ui'                => 1,
                'instructions'      => 'La barre de navigation reste visible au scroll.',
            ],
            [
                'key'               => 'field_ts_navbar_cta_text',
                'label'             => 'Texte du bouton CTA',
                'name'              => 'navbar_cta_text',
                'type'              => 'text',
                'instructions'      => 'Texte affiché dans le bouton d\'appel à l\'action (variante "Avec bouton CTA").',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_navbar_variant',
                            'operator'  => '==',
                            'value'     => 'with_cta',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_navbar_cta_url',
                'label'             => 'Lien du bouton CTA',
                'name'              => 'navbar_cta_url',
                'type'              => 'url',
                'instructions'      => 'URL du bouton d\'appel à l\'action.',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_navbar_variant',
                            'operator'  => '==',
                            'value'     => 'with_cta',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_navbar_search_placeholder',
                'label'             => 'Placeholder du champ recherche',
                'name'              => 'navbar_search_placeholder',
                'type'              => 'text',
                'default_value'     => 'Rechercher…',
                'instructions'      => 'Texte indicatif dans le champ de recherche.',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_navbar_variant',
                            'operator'  => '==',
                            'value'     => 'with_search',
                        ],
                    ],
                ],
            ],

            // ── Footer ──────────────────────────────────────────
            [
                'key'               => 'field_ts_tab_footer',
                'label'             => 'Footer',
                'type'              => 'tab',
            ],
            [
                'key'               => 'field_ts_footer_variant',
                'label'             => 'Style du footer',
                'name'              => 'footer_variant',
                'type'              => 'select',
                'choices'           => [
                    'columns'           => 'Colonnes avec logo et réseaux sociaux',
                    'default'           => 'Liens horizontaux + copyright',
                    'simple'            => 'Simple (logo + copyright)',
                    'with_newsletter'   => 'Colonnes + newsletter',
                    'addresses'         => 'Newsletter + adresses',
                    'pre_footer_cta'    => 'CTA + plan du site',
                    'sitemap_centered'  => 'Plan du site centré',
                ],
                'default_value'     => 'columns',
                'return_format'     => 'value',
                'instructions'      => 'Choisissez le style de pied de page.',
            ],
            [
                'key'               => 'field_ts_footer_color_scheme',
                'label'             => 'Couleurs du footer',
                'name'              => 'footer_color_scheme',
                'type'              => 'select',
                'choices'           => [
                    'dark'          => 'Sombre (fond taupe, texte crème)',
                    'light'         => 'Clair (fond beige, texte taupe)',
                    'white'         => 'Blanc (fond crème, texte taupe)',
                    'sauge'         => 'Sauge (fond sauge, texte blanc)',
                    'mousse'        => 'Mousse (fond mousse, texte blanc)',
                ],
                'default_value'     => 'dark',
                'return_format'     => 'value',
                'instructions'      => 'Palette de couleurs du pied de page.',
            ],
            [
                'key'               => 'field_ts_footer_description',
                'label'             => 'Description',
                'name'              => 'footer_description',
                'type'              => 'textarea',
                'rows'              => 3,
                'instructions'      => 'Courte description affichée sous le logo (ex: slogan, activité).',
            ],
            [
                'key'               => 'field_ts_footer_text',
                'label'             => 'Texte du footer (copyright)',
                'name'              => 'footer_text',
                'type'              => 'textarea',
                'rows'              => 3,
                'instructions'      => 'Texte affiché en bas du footer (ex: copyright, mentions légales). Laissez vide pour un copyright automatique.',
            ],
            [
                'key'               => 'field_ts_footer_menu_message',
                'label'             => '',
                'type'              => 'message',
                'message'           => '<strong>Menus du footer</strong><br>Les menus du footer sont gérés dans <em>Apparence → Menus</em>. Créez des menus et assignez-les aux emplacements <code>Footer 1</code>, <code>Footer 2</code>, <code>Footer 3</code>, <code>Footer 4</code>. Le titre du menu sera utilisé comme titre de colonne.',
            ],

            // ── Footer — CTA (variante pre_footer_cta) ──────────
            [
                'key'               => 'field_ts_footer_cta_message',
                'label'             => '',
                'type'              => 'message',
                'message'           => '<strong>Bloc CTA du footer</strong> (variante « CTA + plan du site » uniquement)',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'pre_footer_cta',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_footer_cta_text',
                'label'             => 'Texte du CTA',
                'name'              => 'footer_cta_text',
                'type'              => 'text',
                'instructions'      => 'Texte descriptif au-dessus des boutons.',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'pre_footer_cta',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_footer_cta_button_text',
                'label'             => 'Bouton principal — Texte',
                'name'              => 'footer_cta_button_text',
                'type'              => 'text',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'pre_footer_cta',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_footer_cta_button_url',
                'label'             => 'Bouton principal — URL',
                'name'              => 'footer_cta_button_url',
                'type'              => 'url',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'pre_footer_cta',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_footer_cta_button2_text',
                'label'             => 'Bouton secondaire — Texte',
                'name'              => 'footer_cta_button2_text',
                'type'              => 'text',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'pre_footer_cta',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_footer_cta_button2_url',
                'label'             => 'Bouton secondaire — URL',
                'name'              => 'footer_cta_button2_url',
                'type'              => 'url',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'pre_footer_cta',
                        ],
                    ],
                ],
            ],

            // ── Footer — Newsletter (variantes with_newsletter + addresses) ──
            [
                'key'               => 'field_ts_footer_newsletter_message',
                'label'             => '',
                'type'              => 'message',
                'message'           => '<strong>Newsletter du footer</strong> (variantes « Colonnes + newsletter » et « Newsletter + adresses »)',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'with_newsletter',
                        ],
                    ],
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'addresses',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_footer_newsletter_heading',
                'label'             => 'Newsletter — Titre',
                'name'              => 'footer_newsletter_heading',
                'type'              => 'text',
                'default_value'     => 'Newsletter',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'with_newsletter',
                        ],
                    ],
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'addresses',
                        ],
                    ],
                ],
            ],
            [
                'key'               => 'field_ts_footer_newsletter_desc',
                'label'             => 'Newsletter — Description',
                'name'              => 'footer_newsletter_description',
                'type'              => 'textarea',
                'rows'              => 2,
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'with_newsletter',
                        ],
                    ],
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'addresses',
                        ],
                    ],
                ],
            ],

            // ── Footer — Adresses (variante addresses) ──────────
            [
                'key'               => 'field_ts_footer_addresses',
                'label'             => 'Adresses',
                'name'              => 'footer_addresses',
                'type'              => 'repeater',
                'layout'            => 'block',
                'min'               => 0,
                'max'               => 6,
                'button_label'      => 'Ajouter une adresse',
                'show_in_graphql'   => true,
                'instructions'      => 'Adresses affichées dans le footer (variante « Newsletter + adresses »).',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'addresses',
                        ],
                    ],
                ],
                'sub_fields'        => [
                    [
                        'key'           => 'field_ts_footer_addr_city',
                        'label'         => 'Ville',
                        'name'          => 'city',
                        'type'          => 'text',
                        'show_in_graphql' => true,
                    ],
                    [
                        'key'           => 'field_ts_footer_addr_address',
                        'label'         => 'Adresse',
                        'name'          => 'address',
                        'type'          => 'textarea',
                        'rows'          => 2,
                        'show_in_graphql' => true,
                    ],
                    [
                        'key'           => 'field_ts_footer_addr_phone',
                        'label'         => 'Téléphone',
                        'name'          => 'phone',
                        'type'          => 'text',
                        'show_in_graphql' => true,
                    ],
                    [
                        'key'           => 'field_ts_footer_addr_email',
                        'label'         => 'Email',
                        'name'          => 'email',
                        'type'          => 'email',
                        'show_in_graphql' => true,
                    ],
                ],
            ],

            // ── Footer — Liens de navigation (variante default) ──
            [
                'key'               => 'field_ts_footer_nav_links',
                'label'             => 'Liens rapides',
                'name'              => 'footer_nav_links',
                'type'              => 'repeater',
                'layout'            => 'table',
                'min'               => 0,
                'max'               => 10,
                'button_label'      => 'Ajouter un lien',
                'show_in_graphql'   => true,
                'instructions'      => 'Liens horizontaux affichés dans le footer (variantes « Liens horizontaux » et « Newsletter + adresses »).',
                'conditional_logic' => [
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'default',
                        ],
                    ],
                    [
                        [
                            'field'     => 'field_ts_footer_variant',
                            'operator'  => '==',
                            'value'     => 'addresses',
                        ],
                    ],
                ],
                'sub_fields'        => [
                    [
                        'key'           => 'field_ts_footer_nav_label',
                        'label'         => 'Libellé',
                        'name'          => 'label',
                        'type'          => 'text',
                        'show_in_graphql' => true,
                    ],
                    [
                        'key'           => 'field_ts_footer_nav_url',
                        'label'         => 'URL',
                        'name'          => 'url',
                        'type'          => 'url',
                        'show_in_graphql' => true,
                    ],
                ],
            ],
        ],
        'location'              => [
            [
                [
                    'param'     => 'options_page',
                    'operator'  => '==',
                    'value'     => 'theme-settings',
                ],
            ],
        ],
        'show_in_graphql'       => true,
        'graphql_field_name'    => 'themeSettings',
    ]);
});
