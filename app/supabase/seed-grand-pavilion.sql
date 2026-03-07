-- ============================================================
-- BAAM System F — Chinese Restaurant Premium
-- seed-grand-pavilion.sql — Grand Pavilion 大观楼 Demo Data
-- Run AFTER chinese-restaurant-schema.sql
-- ============================================================

-- ============================================================
-- Menu Categories
-- ============================================================
insert into public.menu_categories (id, site_id, name, name_zh, slug, menu_type, hours_open, hours_close, sort_order) values
  ('00000000-0000-0000-0001-000000000001', 'grand-pavilion', 'Steamed Dim Sum', '蒸点', 'steamed', 'dim-sum', '10:00', '15:00', 1),
  ('00000000-0000-0000-0001-000000000002', 'grand-pavilion', 'Baked & Pastry', '烘焙', 'baked', 'dim-sum', '10:00', '15:00', 2),
  ('00000000-0000-0000-0001-000000000003', 'grand-pavilion', 'Fried Dim Sum', '酥炸', 'fried', 'dim-sum', '10:00', '15:00', 3),
  ('00000000-0000-0000-0001-000000000004', 'grand-pavilion', 'Congee & Noodles', '粥面', 'congee-noodle', 'dim-sum', '10:00', '15:00', 4),
  ('00000000-0000-0000-0001-000000000005', 'grand-pavilion', 'Dim Sum Desserts', '甜品点心', 'dim-sum-desserts', 'dim-sum', '10:00', '15:00', 5),
  ('00000000-0000-0000-0001-000000000006', 'grand-pavilion', 'Seafood', '海鲜', 'seafood', 'dinner', '17:00', '22:00', 6),
  ('00000000-0000-0000-0001-000000000007', 'grand-pavilion', 'Roasted Meats', '烧味', 'roasted-meats', 'dinner', '17:00', '22:00', 7),
  ('00000000-0000-0000-0001-000000000008', 'grand-pavilion', 'Poultry & Pork', '鸡鸭猪', 'poultry-pork', 'dinner', '17:00', '22:00', 8),
  ('00000000-0000-0000-0001-000000000009', 'grand-pavilion', 'Vegetables & Tofu', '蔬菜豆腐', 'vegetables-tofu', 'dinner', '17:00', '22:00', 9),
  ('00000000-0000-0000-0001-000000000010', 'grand-pavilion', 'Soups', '汤品', 'soups', 'dinner', '17:00', '22:00', 10),
  ('00000000-0000-0000-0001-000000000011', 'grand-pavilion', 'Rice & Noodles', '饭面', 'rice-noodles', 'dinner', '17:00', '22:00', 11),
  ('00000000-0000-0000-0001-000000000012', 'grand-pavilion', 'Chef Signatures', '厨师特色菜', 'chef-signatures', 'chef-signatures', null, null, 12),
  ('00000000-0000-0000-0001-000000000013', 'grand-pavilion', 'Chinese Teas', '中国茶', 'chinese-teas', 'beverages', null, null, 13),
  ('00000000-0000-0000-0001-000000000014', 'grand-pavilion', 'Soft Drinks & Juices', '饮料果汁', 'soft-drinks', 'beverages', null, null, 14),
  ('00000000-0000-0000-0001-000000000015', 'grand-pavilion', 'Chinese Desserts', '中式甜品', 'chinese-desserts', 'desserts', null, null, 15),
  ('00000000-0000-0000-0001-000000000016', 'grand-pavilion', 'Dessert Plates', '甜点拼盘', 'dessert-plates', 'dinner', '17:00', '22:00', 16)
on conflict (site_id, slug, menu_type) do nothing;

-- ============================================================
-- DIM SUM ITEMS (40 items)
-- ============================================================
insert into public.menu_items (site_id, menu_category_id, slug, name, name_zh, description, price, is_dim_sum, dim_sum_category, sort_order) values

-- STEAMED (15 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'har-gow', 'Har Gow', '虾饺', 'Crystal-skin prawn dumplings, 3 per order', 750, true, 'steamed', 1),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'siu-mai', 'Siu Mai', '烧卖', 'Steamed pork and shrimp dumplings with fish roe, 4 per order', 750, true, 'steamed', 2),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'char-siu-bao-steamed', 'Char Siu Bao (Steamed)', '叉烧包（蒸）', 'Fluffy steamed buns with honey-glazed BBQ pork, 3 per order', 650, true, 'steamed', 3),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'cheung-fun-shrimp', 'Shrimp Cheung Fun', '虾肠粉', 'Silky rice noodle rolls with whole prawn filling', 850, true, 'steamed', 4),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'cheung-fun-bbq-pork', 'BBQ Pork Cheung Fun', '叉烧肠粉', 'Silky rice noodle rolls with char siu pork', 800, true, 'steamed', 5),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'xiao-long-bao', 'Xiao Long Bao', '小笼包', 'Shanghai-style soup dumplings, 6 per order', 1050, true, 'steamed', 6),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'lotus-leaf-sticky-rice', 'Lotus Leaf Sticky Rice', '荷叶糯米鸡', 'Glutinous rice with chicken, mushroom, and salted egg, wrapped in lotus leaf', 950, true, 'steamed', 7),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'prawn-dumplings-chilli', 'Crystal Prawn Dumpling with Chilli', '水晶虾饺皇', 'Premium har gow with house chilli oil, 3 per order', 850, true, 'steamed', 8),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'chicken-mushroom-dumpling', 'Chicken & Mushroom Dumpling', '鸡菇饺', 'Tender chicken and shiitake mushroom filling, 3 per order', 750, true, 'steamed', 9),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'vegetable-dumpling', 'Vegetable Dumpling', '素菜饺', 'Water chestnut, carrot, and wood ear mushroom, 4 per order. Vegetarian.', 700, true, 'steamed', 10),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'scallop-siu-mai', 'Scallop Siu Mai', '带子烧卖', 'Premium siu mai topped with whole bay scallop, 3 per order', 1050, true, 'steamed', 11),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'prawn-tofu-dumpling', 'Prawn & Tofu Puff', '豆腐虾饺', 'Light prawn stuffed silken tofu, 3 per order', 850, true, 'steamed', 12),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'beef-ball', 'Beef Ball with Bean Curd Skin', '腐皮牛肉球', 'Seasoned beef ball wrapped in tofu skin, steamed', 750, true, 'steamed', 13),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'chicken-feet-black-bean', 'Chicken Feet in Black Bean Sauce', '豉汁蒸凤爪', 'Traditional braised and steamed chicken feet', 700, true, 'steamed', 14),
('grand-pavilion', '00000000-0000-0000-0001-000000000001', 'spare-ribs-black-bean', 'Spare Ribs in Black Bean Sauce', '豉汁蒸排骨', 'Tender pork spare ribs with fermented black beans', 800, true, 'steamed', 15),

-- BAKED (8 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000002', 'char-siu-bao-baked', 'Char Siu Bao (Baked)', '叉烧包（焗）', 'Golden honey-glazed baked buns with BBQ pork, 3 per order', 700, true, 'baked', 16),
('grand-pavilion', '00000000-0000-0000-0001-000000000002', 'egg-tart-custard', 'Egg Tart', '蛋挞', 'Flaky pastry shell with silky egg custard, 3 per order', 600, true, 'baked', 17),
('grand-pavilion', '00000000-0000-0000-0001-000000000002', 'pineapple-char-siu-bao', 'Pineapple Char Siu Bao', '菠萝叉烧包', 'Baked bun with crispy pineapple topping, 3 per order', 750, true, 'baked', 18),
('grand-pavilion', '00000000-0000-0000-0001-000000000002', 'cocktail-bun', 'Cocktail Bun', '鸡尾包', 'Soft bun filled with coconut cream and butter, 3 per order', 600, true, 'baked', 19),
('grand-pavilion', '00000000-0000-0000-0001-000000000002', 'turnip-cake-baked', 'Baked Turnip Cake', '焗萝卜糕', 'Pan-fried daikon radish cake with XO sauce', 800, true, 'baked', 20),
('grand-pavilion', '00000000-0000-0000-0001-000000000002', 'wife-cake', 'Wife Cake', '老婆饼', 'Traditional flaky pastry with winter melon filling, 2 per order', 650, true, 'baked', 21),
('grand-pavilion', '00000000-0000-0000-0001-000000000002', 'portuguese-egg-tart', 'Portuguese Egg Tart', '葡式蛋挞', 'Caramelized custard in buttery pastry shell, 3 per order', 700, true, 'baked', 22),
('grand-pavilion', '00000000-0000-0000-0001-000000000002', 'water-chestnut-cake', 'Water Chestnut Cake', '马蹄糕', 'Traditional pan-fried chestnut jelly cake, lightly sweetened', 700, true, 'baked', 23),

-- FRIED (8 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000003', 'wu-gok', 'Wu Gok (Taro Puff)', '芋角', 'Crispy taro pastry shell with pork filling, 3 per order', 800, true, 'fried', 24),
('grand-pavilion', '00000000-0000-0000-0001-000000000003', 'spring-roll', 'Spring Roll', '春卷', 'Crispy fried rolls with vegetable and pork filling, 2 per order', 750, true, 'fried', 25),
('grand-pavilion', '00000000-0000-0000-0001-000000000003', 'fried-taro-dumpling', 'Fried Shrimp Dumpling', '炸虾饺', 'Golden fried prawn dumpling, 3 per order', 800, true, 'fried', 26),
('grand-pavilion', '00000000-0000-0000-0001-000000000003', 'fried-sesame-ball', 'Sesame Ball', '煎堆', 'Crispy glutinous rice ball with red bean paste, coated in sesame, 3 per order', 750, true, 'fried', 27),
('grand-pavilion', '00000000-0000-0000-0001-000000000003', 'fried-milk', 'Fried Milk Custard', '炸鲜奶', 'Creamy milk custard in crispy golden batter, 3 per order', 800, true, 'fried', 28),
('grand-pavilion', '00000000-0000-0000-0001-000000000003', 'fried-dough-stick', 'Fried Dough Stick (You Tiao)', '油条', 'Classic Chinese fried dough stick, served with congee', 600, true, 'fried', 29),
('grand-pavilion', '00000000-0000-0000-0001-000000000003', 'fried-rice-roll', 'Fried Rice Paper Roll', '炸芋丝卷', 'Crispy fried rice paper roll with taro and pork', 750, true, 'fried', 30),
('grand-pavilion', '00000000-0000-0000-0001-000000000003', 'fried-wonton', 'Fried Wonton', '炸云吞', 'Crispy fried wontons with shrimp and pork filling, honey mustard dip, 6 per order', 700, true, 'fried', 31),

-- CONGEE & NOODLES (5 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000004', 'congee-century-egg', 'Century Egg & Pork Congee', '皮蛋瘦肉粥', 'Classic Cantonese congee with century egg and lean pork', 900, true, 'congee-noodle', 32),
('grand-pavilion', '00000000-0000-0000-0001-000000000004', 'congee-scallop', 'Dried Scallop Congee', '干贝粥', 'Premium congee with dried Hokkaido scallop and ginger', 1200, true, 'congee-noodle', 33),
('grand-pavilion', '00000000-0000-0000-0001-000000000004', 'wonton-noodle-soup', 'Wonton Noodle Soup', '云吞面', 'Plump shrimp wontons in clear superior broth with thin egg noodles', 1100, true, 'congee-noodle', 34),
('grand-pavilion', '00000000-0000-0000-0001-000000000004', 'rice-noodle-soup', 'Beef Brisket Rice Noodle', '牛腩河粉', 'Tender braised beef brisket with wide rice noodles in clear broth', 1300, true, 'congee-noodle', 35),
('grand-pavilion', '00000000-0000-0000-0001-000000000004', 'plain-congee', 'Plain Congee', '白粥', 'Silky smooth white congee, served with accompaniments', 700, true, 'congee-noodle', 36),

-- DIM SUM DESSERTS (4 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000005', 'mango-pudding', 'Mango Pudding', '芒果布丁', 'House-made fresh mango pudding with cream', 700, true, 'dessert', 37),
('grand-pavilion', '00000000-0000-0000-0001-000000000005', 'red-bean-soup', 'Sweet Red Bean Soup', '红豆沙', 'Warm sweet red bean soup with tangerine peel', 650, true, 'dessert', 38),
('grand-pavilion', '00000000-0000-0000-0001-000000000005', 'taro-tapioca', 'Taro Tapioca Dessert', '芋头西米露', 'Chilled taro and sago pearl in coconut milk', 700, true, 'dessert', 39),
('grand-pavilion', '00000000-0000-0000-0001-000000000005', 'sesame-cake', 'Black Sesame Cake', '黑芝麻糕', 'Silky chilled black sesame and milk cake', 700, true, 'dessert', 40)

on conflict (site_id, slug) do nothing;

-- ============================================================
-- DINNER ITEMS (25 items)
-- ============================================================
insert into public.menu_items (site_id, menu_category_id, slug, name, name_zh, description, price, is_dim_sum, sort_order) values

-- SEAFOOD (8 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'steamed-whole-fish', 'Steamed Whole Fish with Ginger & Scallion', '姜葱蒸全鱼', 'Fresh whole fish, steamed to order with ginger, scallion, and superior soy', 3800, false, 1),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'salt-pepper-shrimp', 'Salt & Pepper Shrimp', '椒盐虾', 'Whole tiger prawn, flash-fried with garlic, chilli, and sea salt', 2800, false, 2),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'crab-ginger-scallion', 'Ginger & Scallion Crab', '姜葱炒蟹', 'Fresh crab stir-fried with ginger and scallion (market price)', null, false, 3),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'clams-black-bean', 'Clams in Black Bean Sauce', '豉汁炒蛤蜊', 'Fresh clams wok-fried with fermented black beans, ginger, and chilli', 2400, false, 4),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'shrimp-garlic-vermicelli', 'Shrimp with Garlic Vermicelli', '蒜蓉粉丝虾', 'Tiger prawns baked with garlic and glass noodles in clay pot', 2800, false, 5),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'scallops-ginger', 'Wok-Fried Scallops', '清炒带子', 'Fresh bay scallops with asparagus, ginger, and Shaoxing wine', 3200, false, 6),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'squid-salt-pepper', 'Salt & Pepper Squid', '椒盐鱿鱼', 'Crispy squid rings with salt, pepper, and fresh chilli', 2200, false, 7),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'braised-tofu-seafood', 'Braised Tofu with Seafood', '海鲜豆腐煲', 'Silken tofu braised with mixed seafood in clay pot', 2600, false, 8),

-- ROASTED MEATS (4 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000007', 'char-siu', 'BBQ Pork (Char Siu)', '叉烧', 'Honey-glazed BBQ pork loin, roasted in traditional oven', 2200, false, 1),
('grand-pavilion', '00000000-0000-0000-0001-000000000007', 'roast-duck', 'Roast Duck', '烧鸭', 'Whole or half roasted duck, crispy skin, served with plum sauce', 2800, false, 2),
('grand-pavilion', '00000000-0000-0000-0001-000000000007', 'crispy-pork-belly', 'Crispy Pork Belly', '脆皮烧肉', 'Perfectly crisped pork belly with five-spice marinade', 2400, false, 3),
('grand-pavilion', '00000000-0000-0000-0001-000000000007', 'roast-chicken', 'Soy Roast Chicken', '豉油鸡', 'Whole chicken poached in master soy stock, chopped to order', 2600, false, 4),

-- POULTRY & PORK (5 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000008', 'kung-pao-chicken', 'Kung Pao Chicken', '宫保鸡丁', 'Sichuan-style wok-fried chicken with peanuts, dried chilli, and Sichuan pepper', 1800, false, 1),
('grand-pavilion', '00000000-0000-0000-0001-000000000008', 'steamed-pork-egg', 'Steamed Minced Pork with Salted Egg', '咸蛋蒸肉饼', 'Classic Cantonese home dish — tender steamed pork with salted duck egg', 1800, false, 2),
('grand-pavilion', '00000000-0000-0000-0001-000000000008', 'lemon-chicken', 'Crispy Lemon Chicken', '柠檬鸡', 'Crispy fried chicken breast with house lemon sauce', 1900, false, 3),
('grand-pavilion', '00000000-0000-0000-0001-000000000008', 'sweet-sour-pork', 'Sweet & Sour Pork', '咕噜肉', 'Classic Cantonese sweet and sour pork with pineapple and peppers', 1900, false, 4),
('grand-pavilion', '00000000-0000-0000-0001-000000000008', 'mapo-tofu-pork', 'Mapo Tofu with Ground Pork', '麻婆豆腐', 'Silken tofu in spicy Sichuan sauce with ground pork', 1700, false, 5),

-- VEGETABLES & TOFU (4 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000009', 'stir-fried-bok-choy', 'Stir-Fried Bok Choy with Garlic', '蒜蓉炒白菜', 'Fresh bok choy wok-tossed with garlic and oyster sauce. Vegetarian.', 1400, false, 1),
('grand-pavilion', '00000000-0000-0000-0001-000000000009', 'clay-pot-tofu', 'Braised Tofu Clay Pot', '红烧豆腐煲', 'Golden fried tofu braised with mixed mushrooms in savory sauce', 1600, false, 2),
('grand-pavilion', '00000000-0000-0000-0001-000000000009', 'mixed-mushroom', 'Mixed Wild Mushroom Stir-Fry', '炒杂菌', 'Seasonal wild mushrooms with garlic and ginger. Vegan.', 1800, false, 3),
('grand-pavilion', '00000000-0000-0000-0001-000000000009', 'eggplant-fish-fragrant', 'Fish-Fragrant Eggplant', '鱼香茄子', 'Silky eggplant in Sichuan fish-fragrant sauce with minced pork', 1700, false, 4),

-- SOUPS (2 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000010', 'hot-sour-soup', 'Hot & Sour Soup', '酸辣汤', 'Cantonese-style hot and sour soup with tofu, wood ear mushroom, and egg', 1400, false, 1),
('grand-pavilion', '00000000-0000-0000-0001-000000000010', 'seafood-soup', 'Seafood Thick Soup', '海鲜羹', 'Classic Cantonese thick soup with shrimp, scallop, and crab', 1800, false, 2),

-- RICE & NOODLES (2 items)
('grand-pavilion', '00000000-0000-0000-0001-000000000011', 'yang-chow-fried-rice', 'Yeung Chow Fried Rice', '扬州炒饭', 'Classic Cantonese fried rice with char siu, shrimp, and egg', 1800, false, 1),
('grand-pavilion', '00000000-0000-0000-0001-000000000011', 'beef-ho-fun', 'Beef Ho Fun', '干炒牛河', 'Cantonese wok-fried wide rice noodles with beef and bean sprouts', 1900, false, 2)

on conflict (site_id, slug) do nothing;

-- ============================================================
-- DINNER SIGNATURES FROM ORIGINAL SET (9 items)
-- ============================================================
insert into public.menu_items (
  site_id,
  menu_category_id,
  slug,
  name,
  name_zh,
  description,
  description_zh,
  price,
  image,
  is_dim_sum,
  is_chef_signature,
  is_available,
  sort_order
) values
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'tuna-tartare', 'Tuna Tartare', '金枪鱼塔塔',
 'Yellowfin tuna, avocado mousse, sesame crisp, ponzu vinaigrette',
 '黄鳍金枪鱼配牛油果慕斯、芝麻脆片与柚子酱油汁',
 2200,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/general/1772609332429-photo-1501595091296-3aa970afb3ff.jpg',
 false, true, true, 31),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'pan-seared-salmon', 'Pan-Seared Salmon', '香煎三文鱼',
 'Crispy skin, lemon beurre blanc, haricots verts, fingerling potatoes',
 '脆皮三文鱼配柠檬白奶油汁、四季豆与小土豆',
 3800,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/general/1772609539385-photo-1625944226626-9bd664656506.jpg',
 false, true, true, 32),
('grand-pavilion', '00000000-0000-0000-0001-000000000008', 'dry-aged-ny-strip', 'Dry-Aged NY Strip', '干式熟成纽约客牛排',
 '45-day dry-aged, 16oz, bone-in, compound herb butter, roasted garlic',
 '45天干式熟成16盎司带骨纽约客，配香草复合黄油与烤蒜',
 6200,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/external/unsplash/e68ce15fc74b0bee4aef18a39994375f2f4b00ed.jpg',
 false, true, true, 33),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'seared-diver-scallops', 'Seared Diver Scallops', '香煎深海带子',
 'Cauliflower purée, brown butter, pancetta, microgreens',
 '花椰菜泥、焦香黄油、意式培根与微型蔬菜',
 4200,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/general/1772609662694-photo-1612204078213-a227dba74093.jpg',
 false, true, true, 34),
('grand-pavilion', '00000000-0000-0000-0001-000000000009', 'grilled-broccolini', 'Grilled Broccolini', '炭烤西兰花苗',
 'Lemon, chili flakes, garlic',
 '柠檬、辣椒碎与蒜香调味',
 1200,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/menu/burrata-1.jpg',
 false, true, true, 35),
('grand-pavilion', '00000000-0000-0000-0001-000000000007', 'roasted-duck-breast', 'Roasted Duck Breast', '香烤鸭胸',
 'Honey-lavender glaze, duck fat confit leg, seasonal greens, cherry jus',
 '蜂蜜薰衣草酱汁，配鸭油慢煮鸭腿、时蔬与樱桃汁',
 4400,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/general/1772609845687-pexels-photo-24038059.jpeg',
 false, true, true, 36),
('grand-pavilion', '00000000-0000-0000-0001-000000000008', 'braised-short-ribs', 'Braised Short Ribs', '红酒慢炖牛小排',
 'Red wine braise, creamy polenta, gremolata, roasted carrots',
 '红酒慢炖，配奶香玉米糊、香草柠檬碎与烤胡萝卜',
 3800,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/general/1772608878879-photo-1593030668930-8130abedd2b0.jpg',
 false, true, true, 37),
('grand-pavilion', '00000000-0000-0000-0001-000000000006', 'hamachi-crudo', 'Hamachi Crudo', '油甘鱼薄切',
 'Yuzu, jalapeño, cilantro, olive oil, sea salt',
 '柚子、墨西哥辣椒、香菜、橄榄油与海盐',
 2400,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/menu/salmon-1.jpg',
 false, true, true, 38),
('grand-pavilion', '00000000-0000-0000-0001-000000000016', 'chocolate-fondant', 'Chocolate Fondant', '熔岩巧克力蛋糕',
 'Warm Valrhona chocolate, salted caramel, vanilla gelato',
 '温热法芙娜巧克力、海盐焦糖与香草冰淇淋',
 1600,
 'https://lrvhgdipkdtjcisinvwl.supabase.co/storage/v1/object/public/media/meridian-diner/menu/chocolate-1.jpg',
 false, true, true, 39)
on conflict (site_id, slug) do update
set
  menu_category_id = excluded.menu_category_id,
  name = excluded.name,
  name_zh = excluded.name_zh,
  description = excluded.description,
  description_zh = excluded.description_zh,
  price = excluded.price,
  image = excluded.image,
  is_dim_sum = excluded.is_dim_sum,
  is_chef_signature = true,
  is_available = true,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ============================================================
-- CHEF SIGNATURES (8 items)
-- ============================================================
insert into public.menu_items (site_id, menu_category_id, slug, name, name_zh, description, price, price_note, is_dim_sum, is_chef_signature, chef_note, pairing_note, origin_region, sort_order) values

('grand-pavilion', '00000000-0000-0000-0001-000000000012', 'peking-duck', 'Peking Duck', '北京烤鸭',
 'Whole Peking duck roasted in our traditional oven — crispy lacquered skin, carved tableside. Served with steamed pancakes, cucumber, scallion, and hoisin. Order 24 hours in advance.',
 8800, null, false, true,
 'This is the crown jewel of our kitchen. Every duck is prepared over three days using the traditional hung and roasted method I learned in Hong Kong. The skin must shatter like glass — that is the only standard I accept.',
 'Pair with a glass of Pinot Noir or our house Pu-erh tea',
 'Beijing/Cantonese', 1),

('grand-pavilion', '00000000-0000-0000-0001-000000000012', 'live-lobster', 'Steamed Live Lobster with Garlic Vermicelli', '清蒸活龙虾配蒜蓉粉丝',
 'Live lobster steamed with garlic and glass noodles, finished with house soy sauce and sesame oil. Market price — inquire with your server.',
 null, 'Market Price 时价', false, true,
 'I never freeze our lobsters. Every day we receive live lobsters and they are held until ordered. This dish should taste like the ocean — clean, sweet, and alive.',
 'Best with our Longjing green tea or a dry Riesling',
 'Cantonese', 2),

('grand-pavilion', '00000000-0000-0000-0001-000000000012', 'braised-abalone', 'Braised South African Abalone', '红焖南非鲍鱼',
 '6-hour braised whole South African abalone in premium oyster sauce. Served individually on braised lettuce with steamed rice.',
 null, 'Market Price 时价', false, true,
 'Abalone is the ultimate expression of Cantonese braising. We braise ours for six hours in a reduction of superior stock and oyster sauce. The result is a texture and depth that cannot be rushed.',
 'Chrysanthemum tea or a delicate Burgundy',
 'Cantonese', 3),

('grand-pavilion', '00000000-0000-0000-0001-000000000012', 'crispy-suckling-pig', 'Crispy Whole Suckling Pig', '脆皮乳猪',
 'Ceremonial whole suckling pig roasted to order — perfect crackling skin, tender meat. Must be ordered 48 hours in advance. Serves 6–10.',
 28800, null, false, true,
 'Our suckling pig is a ceremony. We prepare only two per day and they must be reserved in advance. When the crackling is perfect — and it always is — the sound when you cut it is unmistakable.',
 'Celebrate with champagne or aged Shaoxing wine',
 'Cantonese', 4),

('grand-pavilion', '00000000-0000-0000-0001-000000000012', 'braised-pork-belly', 'Dong Po Pork Belly', '东坡肉',
 'Slow-braised pork belly in Shaoxing wine and soy for 4 hours. Meltingly tender, glazed to deep mahogany. Served with steamed buns.',
 3600, null, false, true,
 'Dong Po Rou is one of the oldest preparations in Chinese cuisine — attributed to the poet Su Dongpo of the Song dynasty. My version uses a 12-hour marinade before braising, which I believe is what makes it exceptional.',
 'Shaoxing Hua Diao wine or a medium-bodied Pinot Noir',
 'Shanghainese/Cantonese', 5),

('grand-pavilion', '00000000-0000-0000-0001-000000000012', 'buddha-jumps-over-wall', 'Buddha Jumps Over the Wall', '佛跳墙',
 'The supreme Cantonese imperial soup: abalone, sea cucumber, fish maw, dried scallop, chicken, ham, mushroom — simmered for 36 hours in superior stock. Minimum order 48 hours advance.',
 null, 'Market Price 时价', false, true,
 'Buddha Jumps Over the Wall is the most complex dish I make. We start the stock three days before service. Each ingredient contributes a different layer of depth. It is the one dish I could not simplify even if asked.',
 'Aged Shao Hsing wine is the only appropriate pairing',
 'Fujianese/Cantonese', 6),

('grand-pavilion', '00000000-0000-0000-0001-000000000012', 'crispy-chicken-signature', 'Master Stock Poached Chicken', '白斩鸡',
 'Free-range chicken poached in our 25-year-old master stock, then chilled and chopped to order. Served with ginger-scallion oil and soy dipping sauces.',
 3200, null, false, true,
 'This dish looks simple but it is the hardest to perfect. The chicken must be poached at exactly the right temperature — too hot and it toughens, too cold and it is unsafe. Our master stock is 25 years old and holds the memory of every chicken we have ever cooked.',
 'Jasmine tea or a light Chablis',
 'Cantonese', 7),

('grand-pavilion', '00000000-0000-0000-0001-000000000012', 'xo-fried-rice', 'XO Sauce Fried Rice with Dried Scallop', '瑤柱XO酱炒饭',
 'Premium fried rice with our house XO sauce, dried Hokkaido scallop, egg, and spring onion. A deceptively simple masterpiece.',
 2800, null, false, true,
 'Our house XO sauce takes 3 days to make. It is the secret to this fried rice. Every grain of rice should be coated separately and have a slight char — what the Cantonese call "wok hei." That is the breath of the wok.',
 'Oolong or a glass of dry Champagne',
 'Cantonese/Hong Kong', 8)

on conflict (site_id, slug) do nothing;

-- ============================================================
-- BEVERAGES (7 items)
-- ============================================================
insert into public.menu_items (site_id, menu_category_id, slug, name, name_zh, description, price, is_dim_sum, is_vegetarian, sort_order) values
('grand-pavilion', '00000000-0000-0000-0001-000000000013', 'tea-jasmine', 'Jasmine Tea', '茉莉花茶', 'Fragrant jasmine blossom tea. Endless refills during dim sum.', 200, false, true, 1),
('grand-pavilion', '00000000-0000-0000-0001-000000000013', 'tea-pu-erh', 'Pu-erh Tea', '普洱茶', 'Aged fermented tea from Yunnan. Rich, earthy, aids digestion.', 300, false, true, 2),
('grand-pavilion', '00000000-0000-0000-0001-000000000013', 'tea-oolong', 'Tieguanyin Oolong', '铁观音', 'Iron Goddess of Mercy — a classic Fujian oolong. Floral and complex.', 300, false, true, 3),
('grand-pavilion', '00000000-0000-0000-0001-000000000013', 'tea-chrysanthemum', 'Chrysanthemum Tea', '菊花茶', 'Cooling floral tea. Traditional pairing for rich Cantonese dishes.', 200, false, true, 4),
('grand-pavilion', '00000000-0000-0000-0001-000000000014', 'soy-milk', 'Fresh Soy Milk', '豆浆', 'Hot or cold fresh soy milk, lightly sweetened', 400, false, true, 5),
('grand-pavilion', '00000000-0000-0000-0001-000000000014', 'sugarcane-juice', 'Fresh Sugarcane Juice', '甘蔗汁', 'Cold-pressed fresh sugarcane with water chestnut', 500, false, true, 6),
('grand-pavilion', '00000000-0000-0000-0001-000000000014', 'lemon-iced-tea', 'Lemon Iced Tea', '柠檬冰茶', 'House-brewed black tea with fresh lemon', 450, false, true, 7)
on conflict (site_id, slug) do nothing;

-- ============================================================
-- WEEKDAY DAILY SPECIALS (1 dish/day)
-- ============================================================
insert into public.menu_daily_specials (site_id, weekday, menu_item_id)
select 'grand-pavilion', 'monday', id
from public.menu_items
where site_id = 'grand-pavilion' and slug = 'har-gow'
on conflict (site_id, weekday) do update
set menu_item_id = excluded.menu_item_id,
    updated_at = now();

insert into public.menu_daily_specials (site_id, weekday, menu_item_id)
select 'grand-pavilion', 'tuesday', id
from public.menu_items
where site_id = 'grand-pavilion' and slug = 'siu-mai'
on conflict (site_id, weekday) do update
set menu_item_id = excluded.menu_item_id,
    updated_at = now();

insert into public.menu_daily_specials (site_id, weekday, menu_item_id)
select 'grand-pavilion', 'wednesday', id
from public.menu_items
where site_id = 'grand-pavilion' and slug = 'salt-pepper-shrimp'
on conflict (site_id, weekday) do update
set menu_item_id = excluded.menu_item_id,
    updated_at = now();

insert into public.menu_daily_specials (site_id, weekday, menu_item_id)
select 'grand-pavilion', 'thursday', id
from public.menu_items
where site_id = 'grand-pavilion' and slug = 'char-siu'
on conflict (site_id, weekday) do update
set menu_item_id = excluded.menu_item_id,
    updated_at = now();

insert into public.menu_daily_specials (site_id, weekday, menu_item_id)
select 'grand-pavilion', 'friday', id
from public.menu_items
where site_id = 'grand-pavilion' and slug = 'peking-duck'
on conflict (site_id, weekday) do update
set menu_item_id = excluded.menu_item_id,
    updated_at = now();

insert into public.menu_daily_specials (site_id, weekday, menu_item_id)
select 'grand-pavilion', 'saturday', id
from public.menu_items
where site_id = 'grand-pavilion' and slug = 'xiao-long-bao'
on conflict (site_id, weekday) do update
set menu_item_id = excluded.menu_item_id,
    updated_at = now();

insert into public.menu_daily_specials (site_id, weekday, menu_item_id)
select 'grand-pavilion', 'sunday', id
from public.menu_items
where site_id = 'grand-pavilion' and slug = 'roast-duck'
on conflict (site_id, weekday) do update
set menu_item_id = excluded.menu_item_id,
    updated_at = now();

-- ============================================================
-- HOMEPAGE SIGNATURE DEFAULTS (Dim Sum + Dinner pool)
-- ============================================================
update public.menu_items mi
set is_chef_signature = false,
    updated_at = now()
where mi.site_id = 'grand-pavilion'
  and exists (
    select 1
    from public.menu_categories mc
    where mc.id = mi.menu_category_id
      and mc.site_id = mi.site_id
      and mc.menu_type in ('dim-sum', 'dinner')
  );

update public.menu_items
set is_chef_signature = true,
    updated_at = now()
where site_id = 'grand-pavilion'
  and slug in (
    'tuna-tartare',
    'pan-seared-salmon',
    'dry-aged-ny-strip',
    'seared-diver-scallops',
    'grilled-broccolini',
    'roasted-duck-breast',
    'braised-short-ribs',
    'hamachi-crudo',
    'chocolate-fondant'
  );

-- ============================================================
-- MAP CLASSIC SIGNATURES INTO REGULAR DINNER CATEGORIES
-- (So they appear under Dinner menu management + signature pool)
-- ============================================================
update public.menu_items
set
  menu_category_id = case slug
    when 'peking-duck' then '00000000-0000-0000-0001-000000000007'::uuid          -- Roasted Meats
    when 'live-lobster' then '00000000-0000-0000-0001-000000000006'::uuid         -- Seafood
    when 'braised-abalone' then '00000000-0000-0000-0001-000000000006'::uuid      -- Seafood
    when 'crispy-suckling-pig' then '00000000-0000-0000-0001-000000000007'::uuid  -- Roasted Meats
    when 'braised-pork-belly' then '00000000-0000-0000-0001-000000000008'::uuid   -- Poultry & Pork
    when 'crispy-chicken-signature' then '00000000-0000-0000-0001-000000000008'::uuid -- Poultry & Pork
    when 'xo-fried-rice' then '00000000-0000-0000-0001-000000000011'::uuid        -- Rice & Noodles
    else menu_category_id
  end,
  is_dim_sum = false,
  is_available = true,
  is_chef_signature = true,
  updated_at = now()
where site_id = 'grand-pavilion'
  and slug in (
    'peking-duck',
    'live-lobster',
    'braised-abalone',
    'crispy-suckling-pig',
    'braised-pork-belly',
    'crispy-chicken-signature',
    'xo-fried-rice'
  );

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
insert into public.team_members (site_id, slug, name, name_zh, role, role_zh, bio, bio_zh, chef_origin, chef_training, credentials, sort_order) values
('grand-pavilion', 'chef-li-wei', 'Chef Li Wei', '李伟', 'Executive Chef & Founder', '行政主厨兼创始人',
 'Born in Guangzhou and trained across Hong Kong''s most celebrated Cantonese kitchens, Chef Li Wei brought his craft to New York in 1998. His devotion to traditional techniques and premium seasonal ingredients has made Grand Pavilion the premier Chinese dining destination in Flushing.',
 '李伟主厨出生于广州，在香港多家顶级粤菜馆接受专业训练，于1998年来到纽约。他对传统厨艺的坚守与对优质食材的执着追求，使大观楼成为法拉盛最顶级的粤菜餐厅。',
 'Hong Kong',
 'Trained in Hong Kong''s finest Cantonese kitchens · 25+ years mastery',
 ARRAY['25+ Years Cantonese Mastery', 'Hong Kong Culinary Trained', '80+ Daily Dim Sum Varieties'],
 1),
('grand-pavilion', 'chef-wong-mei', 'Chef Wong Mei', '黄梅', 'Dim Sum Chef', '点心主厨',
 'Chef Wong Mei leads our dim sum kitchen with 15 years of expertise in traditional Cantonese dim sum craftsmanship.',
 '黄梅主厨带领我们的点心厨房，拥有15年的传统粤式点心制作经验。',
 'Guangdong', '15 years dim sum artisan',
 ARRAY['15 Years Dim Sum Expertise', 'Guangdong Trained'],
 2)
on conflict (site_id, slug) do nothing;

-- ============================================================
-- FESTIVALS
-- ============================================================
insert into public.festivals (site_id, name, name_zh, slug, active_date_start, active_date_end, year, tagline, tagline_zh, description, description_zh, urgency_message, urgency_count, is_active) values
('grand-pavilion', 'Chinese New Year', '农历新年', 'chinese-new-year', '2027-01-18', '2027-02-14', 2027,
 'Usher in the Year of the Goat with a Feast of Tradition',
 '以传统盛宴迎接羊年新春',
 'Grand Pavilion''s most anticipated annual event — an elaborate prix-fixe menu of auspicious Cantonese dishes.',
 '大观楼年度最受期待的盛事——精心策划的粤菜年夜饭套餐。',
 'Only 24 tables remaining for Feb 1 sitting',
 24, true),
('grand-pavilion', 'Mid-Autumn Festival', '中秋节', 'mid-autumn', '2026-09-15', '2026-10-06', 2026,
 'A Season of Reunion, Moonlight, and Cantonese Tradition',
 '团圆月明，粤式传统',
 'Celebrate Mid-Autumn Festival with our special seasonal menu and artisan mooncake gift boxes.',
 '中秋节特别菜单及手工月饼礼盒。',
 'Mooncake gift boxes available while supplies last',
 null, true)
on conflict (site_id, slug, year) do nothing;

-- ============================================================
-- BANQUET PACKAGES
-- ============================================================
insert into public.banquet_packages (site_id, name, name_zh, slug, tier, description, description_zh, price_per_head, min_guests, max_guests, includes, includes_zh, highlight, sort_order) values
('grand-pavilion', 'Business Lunch', '商务午宴', 'business-lunch', 'business-lunch',
 'A refined set lunch for corporate gatherings, client meetings, and team celebrations.',
 '精致商务午宴，适合企业聚餐、客户会面及团队庆典。',
 4500, 10, 50,
 ARRAY['4-course set menu', 'Welcome tea service', 'Private dining room', 'Dedicated service team', 'Complimentary soft drinks'],
 ARRAY['4道精选菜式', '迎宾茶服务', '私人用餐室', '专属服务团队', '免费软饮'],
 'Best for 10–50 guests · Business-appropriate menu',
 1),
('grand-pavilion', 'Celebration Dinner', '庆典晚宴', 'celebration-dinner', 'celebration',
 'Celebrate milestones in style — birthdays, anniversaries, retirements, and family reunions.',
 '以精致格调庆祝人生里程碑——生日、周年纪念、退休及家庭团聚。',
 6800, 10, 80,
 ARRAY['6-course celebration menu', 'Welcome cocktails', 'Customized cake service', 'Private dining room', 'Event decoration coordination', 'Dedicated event manager'],
 ARRAY['6道庆典菜式', '迎宾饮品', '定制蛋糕服务', '私人宴厅', '活动布置协调', '专属活动经理'],
 'Best for 10–80 guests · Birthdays, anniversaries, milestones',
 2),
('grand-pavilion', 'Wedding Banquet', '婚宴', 'wedding-banquet', 'wedding-banquet',
 'Flushing''s finest wedding banquet venue — traditional Cantonese style with modern elegance. Our grand ballroom accommodates up to 500 guests.',
 '法拉盛最优质的婚宴场地——传统粤式风格与现代优雅的完美结合。大宴会厅可容纳多达500位宾客。',
 12800, 50, 500,
 ARRAY['12-course traditional wedding banquet menu', 'Signature whole suckling pig ceremony', 'Bridal suite access', 'Wedding cake coordination', 'Full A/V setup', 'Dedicated wedding coordinator', 'Complimentary champagne toast', 'Bilingual (EN/ZH) service team'],
 ARRAY['12道传统婚宴菜式', '标志性脆皮乳猪仪式', '新娘休息室使用', '婚礼蛋糕协调', '全套影音设备', '专属婚礼统筹师', '免费香槟祝酒', '中英双语服务团队'],
 'Flushing''s premier Cantonese wedding banquet · 50–500 guests',
 3)
on conflict (site_id, slug) do nothing;

-- ============================================================
-- GALLERY ITEMS
-- ============================================================
insert into public.gallery_items (site_id, image, caption, caption_zh, category, sort_order, is_featured) values
('grand-pavilion', '/uploads/grand-pavilion/gallery/food-1.jpg', 'Har Gow — crystal-skin prawn dumplings', '虾饺——晶莹透亮的虾饺', 'food', 1, true),
('grand-pavilion', '/uploads/grand-pavilion/gallery/food-2.jpg', 'Chef''s Peking Duck carved tableside', '厨师现场片北京烤鸭', 'food', 2, true),
('grand-pavilion', '/uploads/grand-pavilion/gallery/food-3.jpg', 'Dim sum spread — morning service', '点心拼盘——早市', 'food', 3, false),
('grand-pavilion', '/uploads/grand-pavilion/gallery/food-4.jpg', 'Fresh seafood from our daily market', '每日新鲜海鲜', 'food', 4, false),
('grand-pavilion', '/uploads/grand-pavilion/gallery/dining-room-1.jpg', 'Main dining room', '主餐厅', 'dining-room', 5, true),
('grand-pavilion', '/uploads/grand-pavilion/gallery/dining-room-2.jpg', 'Private dining room', '私人宴厅', 'dining-room', 6, false),
('grand-pavilion', '/uploads/grand-pavilion/gallery/event-1.jpg', 'Wedding banquet in Grand Ballroom', '大宴会厅婚宴', 'events', 7, true),
('grand-pavilion', '/uploads/grand-pavilion/gallery/festival-1.jpg', 'Chinese New Year celebration', '农历新年庆典', 'festivals', 8, true),
('grand-pavilion', '/uploads/grand-pavilion/gallery/chef-1.jpg', 'Chef Li Wei at work', '李伟主厨工作中', 'chef', 9, true)
on conflict do nothing;
