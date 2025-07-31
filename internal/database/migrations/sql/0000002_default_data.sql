-- Default Profiles
INSERT INTO profiles (
    name, container, extension, pass_thru_common_metadata, 
    flipping, rotation, cropping, limit_value, anamorphic, fill, 
    color, detelecine, interlace_detection, deinterlace, 
    deinterlace_preset, deblock, deblock_tune, denoise, 
    denoise_preset, denoise_tune, chroma_smooth, chroma_smooth_tune,
    sharpen, sharpen_preset, sharpen_tune, colorspace, grayscale, codec, encoder,
    framerate, framerate_type, quality_type, constant_quality,
    average_bitrate, multipass_encoding, preset, tune, profile,
    level, fast_decode, map_untagged_audio_tracks, map_untagged_subtitle_tracks
) VALUES 
-- Any Profile
('Any', 'matroska', 'mkv', 1, 0, 0, 'off', 'none', 'off', 'none', 'black',
'off', 'off', 'off', 'default', 'off', 'medium', 'off', 'light', 'none', 'off',
'none', 'off', 'medium', 'none', 'off', 0, 'Any', '', 'same as source', 'peak Framerate',
'constant quality', 22, 15000, 0, 'medium', 'none', 'auto', 'auto', 0, 1, 1),

-- h264 Profile
('h264', 'matroska', 'mkv', 1, 0, 0, 'off', 'none', 'off', 'none', 'black',
'off', 'off', 'off', 'default', 'off', 'medium', 'off', 'light', 'none', 'off',
'none', 'off', 'medium', 'none', 'off', 0, 'h264', 'libx264', 'same as source', 'peak Framerate',
'constant quality', 22, 15000, 0, 'medium', 'none', 'auto', 'auto', 0, 1, 1),

-- hevc Profile
('hevc', 'matroska', 'mkv', 1, 0, 0, 'off', 'none', 'off', 'none', 'black',
'off', 'off', 'off', 'default', 'off', 'medium', 'off', 'light', 'none', 'off',
'none', 'off', 'medium', 'none', 'off', 0, 'hevc', 'libx265', 'same as source', 'peak Framerate',
'constant quality', 22, 15000, 0, 'medium', 'none', 'auto', 'auto', 0, 1, 1),

-- mpeg4 Profile
('mpeg4', 'matroska', 'mkv', 1, 0, 0, 'off', 'none', 'off', 'none', 'black',
'off', 'off', 'off', 'default', 'off', 'medium', 'off', 'light', 'none', 'off',
'none', 'off', 'medium', 'none', 'off', 0, 'mpeg4', 'mpeg4', 'same as source', 'peak Framerate',
'constant quality', 22, 15000, 0, '', '', '', '', 0, 1, 1),

-- vp8 Profile
('vp8', 'matroska', 'mkv', 1, 0, 0, 'off', 'none', 'off', 'none', 'black',
'off', 'off', 'off', 'default', 'off', 'medium', 'off', 'light', 'none', 'off',
'none', 'off', 'medium', 'none', 'off', 0, 'vp8', 'libvpx', 'same as source', 'peak Framerate',
'constant quality', 22, 15000, 0, 'medium', 'none', 'auto', 'auto', 0, 1, 1),

-- vp9 Profile
('vp9', 'matroska', 'mkv', 1, 0, 0, 'off', 'none', 'off', 'none', 'black',
'off', 'off', 'off', 'default', 'off', 'medium', 'off', 'light', 'none', 'off',
'none', 'off', 'medium', 'none', 'off', 0, 'vp9', 'libvpx-vp9', 'same as source', 'peak Framerate',
'constant quality', 22, 15000, 0, 'medium', 'none', 'auto', 'auto', 0, 1, 1),

-- av1 Profile
('av1', 'matroska', 'mkv', 1, 0, 0, 'off', 'none', 'off', 'none', 'black',
'off', 'off', 'off', 'default', 'off', 'medium', 'off', 'light', 'none', 'off',
'none', 'off', 'medium', 'none', 'off', 0, 'av1', 'libaom-av1', 'same as source', 'peak Framerate',
'constant quality', 22, 15000, 0, '7', 'none', 'auto', 'auto', 0, 1, 1);

-- Default Settings
INSERT INTO settings (
    theme,
    default_profile,
    queue_status,
    queue_startup_state,
    log_level,
    media_view,
    media_sort,
    media_sort_direction,
    media_filter,
    mass_editor_sort,
    mass_editor_sort_direction,
    mass_editor_filter,
    media_poster_size,
    media_poster_detailed_progress_bar,
    media_poster_show_title,
    media_poster_show_monitored,
    media_poster_show_profile,
    media_table_show_network,
    media_table_show_profile,
    media_table_show_seasons,
    media_table_show_episodes,
    media_table_show_episode_count,
    media_table_show_year,
    media_table_show_type,
    media_table_show_size_on_disk,
    media_table_show_size_saved,
    media_table_show_genre,
    media_overview_poster_size,
    media_overview_detailed_progress_bar,
    media_overview_show_monitored,
    media_overview_show_network,
    media_overview_show_profile,
    media_overview_show_season_count,
    media_overview_show_path,
    media_overview_show_size_on_disk,
    queue_filter,
    queue_page_size,
    history_filter,
    history_page_size,
    events_filter,
    events_page_size,
    port,
    created_at,
    updated_at
) VALUES (
    'auto',                  -- theme
    1,                      -- default_profile
    'active',               -- queue_status
    'previous',             -- queue_startup_state
    'info',                 -- log_level
    'posters',              -- media_view
    'title',                -- media_sort
    'ascending',            -- media_sort_direction
    'all',                  -- media_filter
    'title',                -- mass_editor_sort
    'ascending',            -- mass_editor_sort_direction
    'all',                  -- mass_editor_filter
    'medium',               -- media_poster_size
    FALSE,                  -- media_poster_detailed_progress_bar
    TRUE,                   -- media_poster_show_title
    TRUE,                   -- media_poster_show_monitored
    TRUE,                   -- media_poster_show_profile
    FALSE,                  -- media_table_show_network
    TRUE,                   -- media_table_show_profile
    TRUE,                   -- media_table_show_seasons
    TRUE,                   -- media_table_show_episodes
    FALSE,                  -- media_table_show_episode_count
    TRUE,                   -- media_table_show_year
    TRUE,                   -- media_table_show_type
    TRUE,                   -- media_table_show_size_on_disk
    TRUE,                   -- media_table_show_size_saved
    FALSE,                  -- media_table_show_genre
    'medium',               -- media_overview_poster_size
    FALSE,                  -- media_overview_detailed_progress_bar
    TRUE,                   -- media_overview_show_monitored
    TRUE,                   -- media_overview_show_network
    TRUE,                   -- media_overview_show_profile
    TRUE,                   -- media_overview_show_season_count
    FALSE,                  -- media_overview_show_path
    TRUE,                   -- media_overview_show_size_on_disk
    'all',                  -- queue_filter
    12,                     -- queue_page_size
    'all',                  -- history_filter
    15,                     -- history_page_size
    'all',                  -- events_filter
    15,                     -- events_page_size
    7889,                   -- port
    CURRENT_TIMESTAMP,      -- created_at
    CURRENT_TIMESTAMP       -- updated_at
);

-- Default Secrets with generated secret
WITH generated_secret AS (
    SELECT lower(hex(randomblob(32))) as secret
)
INSERT INTO secrets (
    username,
    password,
    secret,
    tmdb_key,
    created_at,
    updated_at
)
SELECT 
    'admin',                -- default username
    '',                     -- empty password (to be set on first login)
    secret,                 -- generated secret
    'ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKaGRXUWlPaUprT1RCalpqQmhaREEyT0dJd01XVXpNVFkxTWpjNVltWXpPRE0xWmpRNU9TSXNJbk4xWWlJNklqWTFOR0UxWVRReE5qZGlOakV6TURFeFpqUXdaV0ZpWVNJc0luTmpiM0JsY3lJNld5SmhjR2xmY21WaFpDSmRMQ0oyWlhKemFXOXVJam94ZlEuNU1LVjViaXV0RmZvQkRuMk14aFMxQU1wbV9DTmE4QTh4WE5XTkFKUVNnTQ==',  -- tmdb_api_key
    CURRENT_TIMESTAMP,      -- created_at
    CURRENT_TIMESTAMP       -- updated_at
FROM generated_secret;