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
                                    'centered' => 'Centré',
                                    'image_right' => 'Image à droite',
                                    'image_left' => 'Image à gauche',
                                    'fullscreen' => 'Plein écran avec fond',
                                ],
                                'default_value' => 'centered',
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
                                        'label' => 'Icône SVG',
                                        'name' => 'icon',
                                        'type' => 'textarea',
                                        'rows' => 2,
                                        'instructions' => 'Code SVG de l\'icône (ex: copier depuis heroicons.com).',
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
                                    'centered' => 'Centré',
                                    'with_image' => 'Avec image',
                                    'dark' => 'Fond sombre',
                                ],
                                'default_value' => 'centered',
                            ],
                            [
                                'key' => 'field_fb_cta_image',
                                'label' => 'Image',
                                'name' => 'image',
                                'type' => 'image',
                                'return_format' => 'array',
                                'conditional_logic' => [
                                    [
                                        [
                                            'field' => 'field_fb_cta_variant',
                                            'operator' => '==',
                                            'value' => 'with_image',
                                        ],
                                    ],
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
                                    'text_only' => 'Texte seul',
                                    'image_right' => 'Image à droite',
                                    'image_left' => 'Image à gauche',
                                ],
                                'default_value' => 'text_only',
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
                                'key' => 'field_fb_testimonials_heading',
                                'label' => 'Titre',
                                'name' => 'heading',
                                'type' => 'text',
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
                                ],
                                'default_value' => 'cards',
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

            // ── Footer ──────────────────────────────────────────
            [
                'key'               => 'field_ts_tab_footer',
                'label'             => 'Footer',
                'type'              => 'tab',
            ],
            [
                'key'               => 'field_ts_footer_text',
                'label'             => 'Texte du footer',
                'name'              => 'footer_text',
                'type'              => 'textarea',
                'rows'              => 3,
                'instructions'      => 'Texte affiché en bas du footer (ex: copyright, mentions).',
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
