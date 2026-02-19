-- Alter database and table to support emojis
ALTER DATABASE travelmates CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
ALTER TABLE destinations CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE trip_variants CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Delete the corrupted entry (assuming it's the one with 'Vietnam' in the name)
DELETE FROM trip_variants WHERE dest_id IN (SELECT dest_id FROM destinations WHERE destination_name = 'Wonders of Vietnam');
DELETE FROM destinations WHERE destination_name = 'Wonders of Vietnam';

-- Re-insert the data
INSERT INTO destinations (country, description, destination_name, end_date, exposure, img_path, price, route, start_date)
VALUES (
    'Vietnam',
    '🛳️ Enjoy the cruise stay while exploring these famous destinations in Vietnam 🇻🇳😍👇\n\n🌉 Golden Bridge, Dragon Bridge, Japanese Bridge\n🚡 Ba Na Hills — World-famous cable car ride\n🏯 Linh Ung Pagoda — Renowned Buddhist Temple\n🛳️ Dragon Dinner Cruise on the Han River\n🏠 Phung Hung — Ancient houses preserved for over 200 years\n🚣 Coconut Basket Boat Ride\n🛳️ Cruise stay at Ha Long Bay\n🏮 Lantern Festival\n🍵 Taste unique local dishes like tea and cassava\n🍬 Visit a Coconut Candy Workshop\n🎶 Enjoy seasonal fruits with traditional Southern Vietnamese music\n🍇 Visit Fruit Farm & Honey Tea Farm\nAnd much more…\n\n🌟 Wonders of Vietnam — Group Tour by WanderWings™ 🌟',
    'Wonders of Vietnam',
    '2026-02-10',
    '7 Nights | 8 Days',
    'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop',
    '1,36,000',
    'Golden Bridge, Dragon Bridge, Japanese Bridge, Ba Na Hills, Ha Long Bay',
    '2026-02-02'
);

SET @dest_id = LAST_INSERT_ID();

INSERT INTO trip_variants (dest_id, duration, price, route_description, source_city, travel_mode)
VALUES 
(@dest_id, '7 Nights | 8 Days', 136000, 'Full Vietnam Tour including Golden Bridge, Ba Na Hills, and Ha Long Bay Cruise', 'Mumbai', 'Flight'),
(@dest_id, '7 Nights | 8 Days', 136000, 'Full Vietnam Tour including Golden Bridge, Ba Na Hills, and Ha Long Bay Cruise', 'Delhi', 'Flight'),
(@dest_id, '7 Nights | 8 Days', 136000, 'Full Vietnam Tour including Golden Bridge, Ba Na Hills, and Ha Long Bay Cruise', 'Bangalore', 'Flight');
