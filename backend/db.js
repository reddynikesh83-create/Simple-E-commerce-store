const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 50 High-Quality Curated Products across 5 Core Categories
const initialProducts = [
  // ==========================================
  // Electronics (1 - 12)
  // ==========================================
  {
    id: 'prod-1',
    title: 'Aura Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 142,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Immersive sound with industry-leading hybrid active noise cancellation and 40-hour battery life.',
    detailedDescription: 'The Aura Wireless Headphones deliver studio-grade acoustics paired with adaptive noise reduction. Crafted with memory foam ear cushions and an ultra-lightweight magnesium alloy frame for all-day comfort. Features Bluetooth 5.3 multi-point pairing, transparency mode, and ultra-fast USB-C quick charge.',
    specs: { 'Driver Size': '40mm Titanium Dome', 'Battery Life': 'Up to 40 hours', 'Connectivity': 'Bluetooth 5.3, 3.5mm AUX', 'Weight': '250g' },
    tags: ['bestseller', 'sale', '3d'],
    reviews: [
      { user: 'Alex M.', rating: 5, comment: 'Phenomenal sound clarity and ANC rivals top tier brands!', date: '2026-09-15' },
      { user: 'Sarah K.', rating: 4, comment: 'Super comfortable for long coding sessions.', date: '2026-09-20' }
    ]
  },
  {
    id: 'prod-2',
    title: 'Horizon Pro Smartwatch & Fitness Tracker',
    category: 'Electronics',
    price: 149.50,
    originalPrice: 179.99,
    rating: 4.6,
    reviewCount: 98,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'Always-On AMOLED display, dual-band GPS, SpO2 blood oxygen, and comprehensive wellness monitoring.',
    detailedDescription: 'Engineered for athletes and active lifestyles, the Horizon Pro combines elegance with durability. Waterproof up to 50 meters, featuring 100+ workout modes, continuous heart rate analysis, sleep staging, and smart notification alerts directly on your wrist.',
    specs: { 'Display': '1.43 inch AMOLED (466x466)', 'Battery Life': 'Up to 10 days', 'Water Resistance': '5 ATM (50m)', 'Compatibility': 'iOS & Android' },
    tags: ['new', 'sale', '3d'],
    reviews: [
      { user: 'David R.', rating: 5, comment: 'Battery lasts more than a week easily. Great screen!', date: '2026-09-18' }
    ]
  },
  {
    id: 'prod-3',
    title: 'Vortex RGB Mechanical Gaming Keyboard',
    category: 'Electronics',
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.7,
    reviewCount: 86,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    description: 'Hot-swappable linear red switches with per-key RGB backlighting and PBT double-shot keycaps.',
    detailedDescription: 'Elevate your gaming and typing precision. Features custom acoustic dampening silicone foam, aircraft-grade aluminum top plate, and full N-key rollover for zero ghosting.',
    specs: { 'Switch Type': 'Hot-Swappable Custom Linear Red', 'Layout': '75% Compact (84 Keys)', 'Keycaps': 'Double-shot PBT', 'RGB': '16.8M Colors' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Liam T.', rating: 5, comment: 'The typing sound is deep and creamy. Highly recommended!', date: '2026-08-30' }
    ]
  },
  {
    id: 'prod-4',
    title: 'Apex 4K Ultra HD Action Camera',
    category: 'Electronics',
    price: 229.00,
    originalPrice: 289.00,
    rating: 4.5,
    reviewCount: 64,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    description: 'Shoot breathtaking 4K 60fps video with 6-axis gyro stabilization and dual touchscreens.',
    detailedDescription: 'Capture your wildest outdoor adventures. Rugged, waterproof down to 33ft without an external case, with voice control, time-lapse, 8x slow motion, and live streaming capabilities.',
    specs: { 'Video Resolution': '4K at 60fps', 'Stabilization': 'HyperSmooth 6-Axis', 'Waterproof': '10m native', 'Screen': 'Dual Front/Rear Touch' },
    tags: ['sale', '3d'],
    reviews: [
      { user: 'Chris B.', rating: 4, comment: 'Video stabilization is mind-blowing.', date: '2026-09-02' }
    ]
  },
  {
    id: 'prod-5',
    title: 'SonicBoom Waterproof Bluetooth Speaker',
    category: 'Electronics',
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.7,
    reviewCount: 110,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    description: '360-degree room-filling acoustic sound with deep bass radiators and IP67 dust/water resistance.',
    detailedDescription: 'Designed for the beach, poolside, and hiking trail. Delivers 24 hours of non-stop playback on a single charge with TWS stereo pairing mode to connect multiple speakers.',
    specs: { 'Output': '30W Stereo Bass', 'Battery Life': '24 Hours', 'Waterproof': 'IP67 Submersible', 'Bluetooth': 'v5.3' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Maya P.', rating: 5, comment: 'Loud, crystal clear bass and floats in water!', date: '2026-09-19' }
    ]
  },
  {
    id: 'prod-6',
    title: 'NovaGlide Wireless Ergonomic Laser Mouse',
    category: 'Electronics',
    price: 54.00,
    originalPrice: 69.00,
    rating: 4.6,
    reviewCount: 74,
    stock: 32,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    description: 'Precision ergonomic contour with hyper-fast scroll wheel, thumb rest, and silent click switches.',
    detailedDescription: 'Crafted to eliminate wrist strain during extended work hours. Multi-device Bluetooth 5.0 and 2.4GHz wireless connectivity switchable between 3 devices with one button.',
    specs: { 'Sensor': '4000 DPI Darkfield Laser', 'Battery': 'Rechargeable USB-C (70 days)', 'Buttons': '7 Programmable' },
    tags: ['new'],
    reviews: [
      { user: 'Kevin J.', rating: 5, comment: 'Wrist pain vanished completely within a week.', date: '2026-09-22' }
    ]
  },
  {
    id: 'prod-7',
    title: 'ClarityAir ANC Wireless True Earbuds',
    category: 'Electronics',
    price: 119.00,
    originalPrice: 149.00,
    rating: 4.8,
    reviewCount: 135,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    description: 'Custom acoustic architecture with active ambient noise reduction, wireless charging case, and IPX5.',
    detailedDescription: 'Experience studio highs and punchy sub-bass in an ultra-compact earbud. Quad microphones with beamforming technology filter wind and ambient noise for crystal clear phone calls.',
    specs: { 'Playtime': '8 hrs earbud + 32 hrs case', 'ANC': 'Active Hybrid Noise Cancellation', 'Charging': 'Qi Wireless & USB-C' },
    tags: ['bestseller', 'sale'],
    reviews: [
      { user: 'Danielle W.', rating: 5, comment: 'Soundstage is incredible for true wireless earbuds.', date: '2026-09-12' }
    ]
  },
  {
    id: 'prod-8',
    title: 'Lumos 4K HDR GPS Explorer Drone',
    category: 'Electronics',
    price: 389.00,
    originalPrice: 450.00,
    rating: 4.7,
    reviewCount: 52,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    description: 'Foldable quadcopter with 3-axis mechanical gimbal, 10km video transmission, and 35-min flight time.',
    detailedDescription: 'Engineered for aerial creators. Features Level 5 wind resistance, automatic subject tracking (Follow Me), return-to-home fail-safe GPS, and point-of-interest orbit modes.',
    specs: { 'Camera': '4K HDR at 30fps / 12MP RAW', 'Flight Time': '35 Minutes', 'Range': '10 km Transmission', 'Weight': '249g' },
    tags: ['new'],
    reviews: [
      { user: 'Marcus T.', rating: 5, comment: 'Extremely stable video even in 20mph gusts of wind.', date: '2026-09-04' }
    ]
  },
  {
    id: 'prod-9',
    title: 'PulseStream Studio USB Condenser Microphone',
    category: 'Electronics',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewCount: 88,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1590658006821-04f4008d5717?w=800&auto=format&fit=crop&q=80',
    description: 'Cardioid broadcast condenser microphone with internal shock mount and zero-latency headphone monitoring.',
    detailedDescription: 'The preferred choice for podcasting, streaming, and voiceover work. Plug-and-play USB connection, integrated tap-to-mute sensor with LED status indicator, and precision gain dial.',
    specs: { 'Polar Pattern': 'Cardioid', 'Sample Rate': '192kHz / 24-bit', 'Interface': 'USB-C Plug & Play', 'Monitoring': '3.5mm Jack' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Greg S.', rating: 5, comment: 'Voice sounds rich and warm right out of the box.', date: '2026-09-14' }
    ]
  },
  {
    id: 'prod-10',
    title: 'UltraView 27-inch 165Hz QHD Gaming Monitor',
    category: 'Electronics',
    price: 279.00,
    originalPrice: 349.00,
    rating: 4.6,
    reviewCount: 95,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    description: '2560x1440 Fast IPS panel with 1ms response time, AMD FreeSync Premium, and 99% sRGB color gamut.',
    detailedDescription: 'Fluid motion and razor-sharp clarity for competitive gaming and color-accurate design work. Features height, tilt, swivel, and pivot ergonomic adjustment stand.',
    specs: { 'Resolution': '2560 x 1440 (2K QHD)', 'Refresh Rate': '165Hz', 'Response Time': '1ms MPRT', 'Panel': 'Fast IPS' },
    tags: ['sale'],
    reviews: [
      { user: 'Jason F.', rating: 5, comment: 'Zero backlight bleed, smooth as butter at 165Hz.', date: '2026-09-17' }
    ]
  },
  {
    id: 'prod-11',
    title: 'HyperCharge 65W GaN Fast Wall Charger',
    category: 'Electronics',
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.9,
    reviewCount: 160,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    description: 'Gallium Nitride (GaN III) compact 3-port charger capable of powering laptops, phones, and tablets.',
    detailedDescription: 'Replaces bulky laptop bricks. Delivers up to 65W power delivery over USB-C, charging a MacBook Pro to 50% in just 30 minutes with built-in thermal protection safeguards.',
    specs: { 'Total Wattage': '65W Max', 'Ports': '2x USB-C PD 3.0 + 1x USB-A', 'Technology': 'GaN III Fast Tech', 'Foldable': 'Yes' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Elena R.', rating: 5, comment: 'Powers my laptop and phone simultaneously without getting warm.', date: '2026-09-21' }
    ]
  },
  {
    id: 'prod-12',
    title: 'Stealth Neo All-in-One VR Headset',
    category: 'Electronics',
    price: 299.00,
    originalPrice: 379.00,
    rating: 4.6,
    reviewCount: 68,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=80',
    description: 'Standalone wireless virtual reality headset with 4K LCD optics, inside-out tracking, and spatial 3D audio.',
    detailedDescription: 'Step straight into immersive gaming and virtual collaboration without cables or PC required. Ergonomic counterweighted strap and intuitive haptic touch controllers.',
    specs: { 'Display': '1832 x 1920 per eye', 'Refresh Rate': '120Hz', 'Tracking': '6DoF Inside-Out', 'Storage': '128GB High-Speed' },
    tags: ['new', 'sale'],
    reviews: [
      { user: 'Brad N.', rating: 5, comment: 'Mind blowing graphics and total freedom without wires.', date: '2026-09-08' }
    ]
  },

  // ==========================================
  // Fashion & Apparel (13 - 24)
  // ==========================================
  {
    id: 'prod-13',
    title: 'Artisan Full-Grain Leather Messenger Bag',
    category: 'Fashion',
    price: 119.00,
    originalPrice: 159.00,
    rating: 4.9,
    reviewCount: 112,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    description: 'Handcrafted genuine leather messenger bag with padded 15.6" laptop compartment and antique brass buckles.',
    detailedDescription: 'Constructed from premium top-grain cowhide leather that develops a rich patina over time. Designed with reinforced stitching, padded shoulder straps, and quick-access magnetic snap closures.',
    specs: { 'Material': '100% Full-grain buffalo leather', 'Dimensions': '16" W x 12" H x 4.5" D', 'Laptop Sleeve': 'Fits 15.6 inch laptops' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Mark S.', rating: 5, comment: 'The leather smell and craftsmanship are exceptional.', date: '2026-09-12' }
    ]
  },
  {
    id: 'prod-14',
    title: 'Minimalist Heavyweight Cotton Hoodie',
    category: 'Fashion',
    price: 59.00,
    originalPrice: 75.00,
    rating: 4.7,
    reviewCount: 89,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    description: '450 GSM luxury brushed organic cotton hoodie with tailored relaxed drape and double-lined hood.',
    detailedDescription: 'The ultimate essential pullover hoodie. Pre-shrunk French terry weave providing warmth, breathability, and structural durability. No loud logos—just pure silhouette and timeless elegance.',
    specs: { 'Material': '100% Organic Cotton (450 GSM)', 'Fit': 'Contemporary Relaxed Fit', 'Care': 'Machine wash cold' },
    tags: ['new'],
    reviews: [
      { user: 'Jessica P.', rating: 5, comment: 'Thick, super cozy, and holds its shape after washes.', date: '2026-09-19' }
    ]
  },
  {
    id: 'prod-15',
    title: 'AeroStride Lightweight Running Shoes',
    category: 'Fashion',
    price: 85.00,
    originalPrice: 110.00,
    rating: 4.6,
    reviewCount: 77,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: 'High-energy return responsive cushioning with engineered breathable mesh upper for daily miles.',
    detailedDescription: 'Engineered for runners seeking speed, cushion, and agility. The responsive nitrogen-infused foam midsole absorbs ground impact while giving explosive toe-offs.',
    specs: { 'Upper': 'Engineered Jacquard Breathable Mesh', 'Midsole': 'Nitrogen-Infused Energy Foam', 'Weight': '210g' },
    tags: ['sale'],
    reviews: [
      { user: 'Nathan L.', rating: 5, comment: 'Like walking on clouds! Shaved seconds off my 5k.', date: '2026-09-24' }
    ]
  },
  {
    id: 'prod-16',
    title: 'Voyager Polarized Titanium Sunglasses',
    category: 'Fashion',
    price: 48.00,
    originalPrice: 65.00,
    rating: 4.8,
    reviewCount: 53,
    stock: 32,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    description: 'Ultra-lightweight titanium frames with HD polarized UV400 anti-glare scratch-resistant lenses.',
    detailedDescription: 'Timeless modern geometric aviator silhouette. Built with memory flex titanium hinges that effortlessly contour to your face without pinching.',
    specs: { 'Lens Protection': '100% UV400 & Polarized', 'Frame': 'Aerospace Beta-Titanium', 'Weight': '18 grams' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Emily W.', rating: 5, comment: 'So light you forget you have them on. Crystal clear lenses.', date: '2026-08-25' }
    ]
  },
  {
    id: 'prod-17',
    title: 'Chronos Sapphire Minimalist Quartz Watch',
    category: 'Fashion',
    price: 125.00,
    originalPrice: 160.00,
    rating: 4.8,
    reviewCount: 65,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    description: 'Surgical stainless steel case with scratch-proof sapphire crystal glass and genuine Italian calfskin strap.',
    detailedDescription: 'Understated Scandinavian minimalist aesthetic. Powered by high-accuracy Japanese Miyota quartz movement with 50-meter water resistance.',
    specs: { 'Case Diameter': '40mm', 'Glass': 'Scratch-Proof Sapphire Crystal', 'Movement': 'Japanese Miyota Quartz', 'Water Resistance': '5 ATM' },
    tags: ['bestseller', 'sale'],
    reviews: [
      { user: 'Robert D.', rating: 5, comment: 'Looks like a $500 luxury timepiece. Clean and classy.', date: '2026-09-11' }
    ]
  },
  {
    id: 'prod-18',
    title: 'UrbanNomad Weatherproof Commuter Backpack',
    category: 'Fashion',
    price: 92.00,
    originalPrice: 120.00,
    rating: 4.7,
    reviewCount: 84,
    stock: 26,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    description: 'Cordura ballistic nylon backpack with waterproof YKK AquaGuard zippers and magnetic Fidlock buckles.',
    detailedDescription: 'Designed for modern city commuters and digital nomads. Features dedicated padded sleeves for a 16" laptop and tablet, hidden passport pocket, and luggage pass-through strap.',
    specs: { 'Capacity': '24 Liters', 'Material': '1000D Cordura Waterproof Nylon', 'Laptop Sleeve': 'Fits 16" MacBook' },
    tags: ['new'],
    reviews: [
      { user: 'Simon B.', rating: 5, comment: 'Rode through a torrential storm and my laptop was bone dry.', date: '2026-09-16' }
    ]
  },
  {
    id: 'prod-19',
    title: 'Heritage Raw Selvedge Denim Trucker Jacket',
    category: 'Fashion',
    price: 110.00,
    originalPrice: 145.00,
    rating: 4.6,
    reviewCount: 48,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    description: '14oz rigid Japanese selvedge denim jacket with custom brass shank hardware and reinforced bar-tacks.',
    detailedDescription: 'Woven on vintage shuttle looms. Raw, unwashed indigo denim that develops personalized fades and wear whiskers unique to your lifestyle over years of use.',
    specs: { 'Fabric': '100% Japanese Selvedge Cotton (14oz)', 'Hardware': 'Custom Antique Copper', 'Pockets': '4 Exterior + 2 Interior' },
    tags: ['sale'],
    reviews: [
      { user: 'Garrett M.', rating: 5, comment: 'Stiff at first, breaking in beautifully. True heirloom denim.', date: '2026-09-02' }
    ]
  },
  {
    id: 'prod-20',
    title: 'Apex Carbon Fiber RFID Blocking Slim Wallet',
    category: 'Fashion',
    price: 38.50,
    originalPrice: 49.00,
    rating: 4.9,
    reviewCount: 140,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    description: 'Military-grade 3K matte carbon fiber plates with flexible elastic cash strap and RFID protection.',
    detailedDescription: 'Holds up to 12 cards without stretching out. Slips into your front pocket with zero bulk while completely shielding your RFID-enabled chips from digital pickpockets.',
    specs: { 'Material': '3K Real Carbon Fiber & Aluminum', 'Capacity': '1-12 Cards + Cash', 'Weight': '45 grams' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Austin V.', rating: 5, comment: 'Thrown away my bulky leather bi-fold forever.', date: '2026-09-18' }
    ]
  },
  {
    id: 'prod-21',
    title: 'Chelsea Suede Handcrafted Ankle Boots',
    category: 'Fashion',
    price: 135.00,
    originalPrice: 175.00,
    rating: 4.8,
    reviewCount: 62,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80',
    description: 'Supple Italian suede leather with Goodyear welted crepe sole and durable elastic side gussets.',
    detailedDescription: 'Hand-lasted for superior arch support. Features a cushioned cork footbed that molds to your unique foot shape over time with water-resistant Scotchgard treatment.',
    specs: { 'Upper': 'Premium Italian Suede', 'Sole': 'Natural Crepe Rubber', 'Construction': 'Goodyear Welted' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Christian K.', rating: 5, comment: 'Unmatched comfort and looks great dressed up or down.', date: '2026-09-15' }
    ]
  },
  {
    id: 'prod-22',
    title: 'LuxeCashmere Ribbed Knit Winter Scarf',
    category: 'Fashion',
    price: 42.00,
    originalPrice: 55.00,
    rating: 4.7,
    reviewCount: 45,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80',
    description: '100% Grade-A Mongolian cashmere scarf with ribbed texture and ultra-soft featherlight warmth.',
    detailedDescription: 'Sustainably sourced and exceptionally soft against sensitive skin. Provides natural temperature regulation without any itchy scratchiness.',
    specs: { 'Material': '100% Pure Mongolian Cashmere', 'Dimensions': '70" L x 12" W', 'Care': 'Dry clean or gentle hand wash' },
    tags: ['new'],
    reviews: [
      { user: 'Danica H.', rating: 5, comment: 'Incredibly soft and keeps the winter wind out completely.', date: '2026-09-20' }
    ]
  },
  {
    id: 'prod-23',
    title: 'RetroCourt Low-Top Leather Sneakers',
    category: 'Fashion',
    price: 78.00,
    originalPrice: 98.00,
    rating: 4.6,
    reviewCount: 82,
    stock: 29,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    description: 'Vintage 80s court silhouette with smooth leather upper, perforated toe box, and gum rubber outsole.',
    detailedDescription: 'Clean minimalist sneakers for effortless styling. Equipped with an OrthoLite antimicrobial cushioned insole and reinforced stitching around the sole rim.',
    specs: { 'Upper': 'Full-Grain Soft Leather', 'Insole': 'OrthoLite Memory Foam', 'Outsole': 'Vulcanized Gum Rubber' },
    tags: ['sale'],
    reviews: [
      { user: 'Tyler C.', rating: 5, comment: 'Goes with literally every outfit I own. Super comfortable.', date: '2026-09-10' }
    ]
  },
  {
    id: 'prod-24',
    title: 'Classic Merino Wool Tailored Polo',
    category: 'Fashion',
    price: 52.00,
    originalPrice: 68.00,
    rating: 4.7,
    reviewCount: 57,
    stock: 38,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    description: '100% Extra-fine 19.5 micron merino wool knit polo shirt with mother-of-pearl buttons.',
    detailedDescription: 'Naturally odor-resistant, moisture-wicking, and temperature-regulating. Drapes cleanly for business casual or weekend relaxation.',
    specs: { 'Material': '100% Extra-fine Australian Merino Wool', 'Knit': '12-Gauge Fine Knit', 'Fit': 'Modern Tailored' },
    tags: ['new'],
    reviews: [
      { user: 'Philip E.', rating: 5, comment: 'Breathable in warm weather and warm in cool weather.', date: '2026-09-09' }
    ]
  },

  // ==========================================
  // Home & Living (25 - 36)
  // ==========================================
  {
    id: 'prod-25',
    title: 'Nordic Ceramic Pour-Over Coffee Brewer',
    category: 'Home & Living',
    price: 36.00,
    originalPrice: 48.00,
    rating: 4.9,
    reviewCount: 68,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    description: 'Hand-glazed ceramic dripper with thermal heat retention and matching insulated borosilicate carafe.',
    detailedDescription: 'Master the art of manual coffee brewing. The interior spiral ribbing regulates extraction flow rate for rich, balanced aromatic coffee notes every single morning.',
    specs: { 'Material': 'Stoneware Ceramic & Borosilicate Glass', 'Capacity': '600ml (2-4 cups)', 'Filter': 'Standard V60 02' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Dan B.', rating: 5, comment: 'Every coffee lover needs this. Beautiful countertop piece too.', date: '2026-09-08' }
    ]
  },
  {
    id: 'prod-26',
    title: 'AromaPure Ultrasonic Ambient Diffuser',
    category: 'Home & Living',
    price: 32.50,
    originalPrice: 42.00,
    rating: 4.7,
    reviewCount: 91,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
    description: 'Quiet ultrasonic cool mist aromatherapy diffuser with 7 ambient warm lighting modes and auto shut-off.',
    detailedDescription: 'Transform any room into a tranquil spa retreat. Uses high-frequency sound waves to atomize water and essential oils without heat, keeping botanical therapeutic compounds intact.',
    specs: { 'Water Tank': '300ml (Up to 12 hrs)', 'Noise': '<20dB Whisper Quiet', 'Lighting': '7 Calming LED Colors' },
    tags: ['sale'],
    reviews: [
      { user: 'Rachel Z.', rating: 5, comment: 'Love the soothing mist and timer feature before sleep.', date: '2026-09-11' }
    ]
  },
  {
    id: 'prod-27',
    title: 'Lumina Minimalist Desk Lamp & Qi Charger',
    category: 'Home & Living',
    price: 52.00,
    originalPrice: 69.00,
    rating: 4.8,
    reviewCount: 45,
    stock: 19,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    description: 'Eye-caring anti-blue light LED bar with 5 color temperatures, touch slider dimmer, and 15W wireless base.',
    detailedDescription: 'The centerpiece for any productive workspace. Glare-free asymmetric optical design illuminates your desk without screen reflection. Built-in 15W Qi fast charging pad keeps your phone powered.',
    specs: { 'Brightness': '900 Lumens (CRI > 95)', 'Color Temp': '2700K - 6500K', 'Charging': '15W Fast Wireless' },
    tags: ['new'],
    reviews: [
      { user: 'Henry T.', rating: 5, comment: 'Cleared clutter from my desk. The wireless charger is so handy.', date: '2026-09-22' }
    ]
  },
  {
    id: 'prod-28',
    title: 'ErgoCloud Memory Foam Lumbar Support Cushion',
    category: 'Home & Living',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.6,
    reviewCount: 104,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    description: 'Orthopedic contoured memory foam cushion with breathable 3D mesh cover and dual adjustable straps.',
    detailedDescription: 'Alleviate back strain and improve spine alignment during long hours at your desk or in your car. Features temperature-neutral memory foam that molds to your unique lumbar curve.',
    specs: { 'Foam': '100% High-Density Slow-Rebound Foam', 'Cover': 'Removable & Washable 3D Mesh', 'Straps': 'Dual Heavy-duty' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Vikram S.', rating: 5, comment: 'Cured my lower back ache within 3 days. A must-have for programmers.', date: '2026-09-14' }
    ]
  },
  {
    id: 'prod-29',
    title: 'AeroPress Precision Cold Brew & Coffee System',
    category: 'Home & Living',
    price: 44.00,
    originalPrice: 58.00,
    rating: 4.8,
    reviewCount: 78,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    description: 'Rapid immersion brewing system making smooth espresso-style concentrate and cold brew in 1 minute.',
    detailedDescription: 'Patented micro-filter technology prevents grit in your cup. Lightweight and shatterproof for camping, travel, or quick morning routines.',
    specs: { 'Brew Time': '1 Minute', 'Capacity': '1 to 3 Servings', 'BPA Free': 'Food-Grade Copolyester' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Liam O.', rating: 5, comment: 'Zero bitterness, the smoothest cup of coffee I have ever brewed.', date: '2026-09-03' }
    ]
  },
  {
    id: 'prod-30',
    title: 'EmberGlow Hand-Poured Soy Wax Scented Candle',
    category: 'Home & Living',
    price: 24.00,
    originalPrice: 32.00,
    rating: 4.9,
    reviewCount: 88,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
    description: 'Natural soy wax candle with crackling wooden wick, scented with smoked cedarwood, amber, and vanilla.',
    detailedDescription: 'Poured into a matte ceramic reusable vessel. Burns cleanly for up to 60 hours without toxic paraffin or petroleum soot.',
    specs: { 'Wax': '100% Natural USA Soy Wax', 'Burn Time': '55-60 Hours', 'Wick': 'Natural Crackling Hardwood' },
    tags: ['new'],
    reviews: [
      { user: 'Clara M.', rating: 5, comment: 'The wood wick crackle sound creates the coziest evening ambiance.', date: '2026-09-13' }
    ]
  },
  {
    id: 'prod-31',
    title: 'SilkenWeave 15lb Cooling Weighted Blanket',
    category: 'Home & Living',
    price: 89.00,
    originalPrice: 119.00,
    rating: 4.7,
    reviewCount: 63,
    stock: 17,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
    description: 'Breathable bamboo viscose weighted blanket filled with hypoallergenic micro-glass beads for deep sleep.',
    detailedDescription: 'Applies gentle, even deep touch pressure simulation (DTPS) that calms the nervous system and eases anxiety without trapping body heat.',
    specs: { 'Weight': '15 lbs (Ideal for 130-180 lb adults)', 'Fabric': '100% Organic Bamboo Viscose', 'Filling': 'Micro-Glass Beads' },
    tags: ['sale'],
    reviews: [
      { user: 'Sandra P.', rating: 5, comment: 'I fall asleep in minutes now. Stays cool all night long.', date: '2026-09-07' }
    ]
  },
  {
    id: 'prod-32',
    title: 'Zenith Ergonomic Mesh Executive Office Chair',
    category: 'Home & Living',
    price: 249.00,
    originalPrice: 319.00,
    rating: 4.8,
    reviewCount: 92,
    stock: 11,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80',
    description: 'Full breathable mesh task chair with dynamic self-adjusting lumbar, 3D armrests, and 135° recline lock.',
    detailedDescription: 'Engineered for 10+ hour seating comfort. The waterfall seat edge relieves pressure behind thighs while high-tensile mesh promotes continuous airflow.',
    specs: { 'Weight Capacity': '330 lbs', 'Recline': '90° to 135° Synchro-tilt', 'Base': 'Heavy-Duty BIFMA Aluminum' },
    tags: ['bestseller', 'sale'],
    reviews: [
      { user: 'Andrew W.', rating: 5, comment: 'Build quality rivals chairs costing three times as much.', date: '2026-09-18' }
    ]
  },
  {
    id: 'prod-33',
    title: 'PureAir True HEPA H13 Room Air Purifier',
    category: 'Home & Living',
    price: 75.00,
    originalPrice: 99.00,
    rating: 4.8,
    reviewCount: 115,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    description: '3-stage filtration with True HEPA H13 filter capturing 99.97% of airborne dust, smoke, pet dander, and odors.',
    detailedDescription: 'Cleans 250 sq ft in 12 minutes. Features real-time air quality indicator light, sleep mode at 22dB, and child lock feature.',
    specs: { 'Coverage': 'Up to 500 sq ft', 'Filter': '3-Stage H13 True HEPA + Carbon', 'Noise': '22dB Sleep Mode' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Chloe B.', rating: 5, comment: 'Massive difference in allergy relief waking up every morning.', date: '2026-09-21' }
    ]
  },
  {
    id: 'prod-34',
    title: 'Minimalist Ceramic Plant Pot with Walnut Stand',
    category: 'Home & Living',
    price: 28.00,
    originalPrice: 38.00,
    rating: 4.6,
    reviewCount: 54,
    stock: 36,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80',
    description: 'Mid-century matte cylinder planter pot with drainage hole, plug, and reversible solid walnut wood stand.',
    detailedDescription: 'Elevate your fiddle leaf fig, snake plant, or monstera. High-temperature stoneware ceramic finished with a smooth matte glaze.',
    specs: { 'Pot Diameter': '10 inch', 'Material': 'High-Fire Ceramic & Solid Walnut', 'Drainage': 'Hole with silicone plug' },
    tags: ['new'],
    reviews: [
      { user: 'Tanya R.', rating: 5, comment: 'Looks so chic in our living room corner.', date: '2026-09-05' }
    ]
  },
  {
    id: 'prod-35',
    title: 'SmartHydro Temperature Display Insulated Mug',
    category: 'Home & Living',
    price: 34.00,
    originalPrice: 45.00,
    rating: 4.7,
    reviewCount: 71,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
    description: 'Vacuum insulated coffee tumbler with touch LED lid showing drink temperature in real-time.',
    detailedDescription: 'Double-wall 18/8 food-grade stainless steel keeps coffee scalding hot for 8 hours and iced drinks cold for 16 hours. Leak-proof screw cap with flip lid.',
    specs: { 'Capacity': '500ml (17oz)', 'Insulation': 'Double Wall Vacuum', 'Display': 'Touch OLED Screen on Lid' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Lucas G.', rating: 5, comment: 'Never burn my tongue again, tap lid to check exact temp!', date: '2026-09-17' }
    ]
  },
  {
    id: 'prod-36',
    title: 'Bamboo Organics 4-Piece Bathroom Accessories Set',
    category: 'Home & Living',
    price: 31.00,
    originalPrice: 42.00,
    rating: 4.6,
    reviewCount: 49,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    description: 'Sustainable natural bamboo vanity set including soap dispenser, toothbrush holder, tumbler, and soap dish.',
    detailedDescription: 'Water-resistant carbonized bamboo treated against mildew and humidity. Brings clean organic spa tranquility to any bathroom countertop.',
    specs: { 'Material': '100% Natural Carbonized Bamboo', 'Includes': 'Soap Dispenser, Toothbrush Cup, Tumbler, Tray' },
    tags: ['new'],
    reviews: [
      { user: 'Heather K.', rating: 5, comment: 'Great quality, natural wood finish feels luxurious.', date: '2026-09-06' }
    ]
  },

  // ==========================================
  // Sports & Fitness (37 - 44)
  // ==========================================
  {
    id: 'prod-37',
    title: 'FlexiGrip Non-Slip Pro 6mm Yoga Mat',
    category: 'Sports & Fitness',
    price: 42.00,
    originalPrice: 55.00,
    rating: 4.9,
    reviewCount: 82,
    stock: 33,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
    description: 'Eco-friendly biodegradable natural rubber mat with laser-engraved alignment lines and sweat grip.',
    detailedDescription: '6mm high-density cushioning protects knees, elbows, and joints. The wet-absorbent polyurethane top coat provides unwavering grip even in sweaty hot yoga.',
    specs: { 'Thickness': '6mm Dual Layer', 'Material': 'Natural Tree Rubber + Eco PU', 'Dimensions': '72" x 26"' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Alicia M.', rating: 5, comment: 'Zero slipping in sweaty hot vinyasa. Best mat on the market.', date: '2026-09-16' }
    ]
  },
  {
    id: 'prod-38',
    title: 'IronCore Heavy-Duty Resistance Bands Set',
    category: 'Sports & Fitness',
    price: 26.00,
    originalPrice: 35.00,
    rating: 4.8,
    reviewCount: 96,
    stock: 48,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80',
    description: '5 color-coded 100% natural Malaysian latex bands with foam handles, ankle straps, and door anchor.',
    detailedDescription: 'Stackable resistance from 10 lbs up to 150 lbs. Full portable gym system for strength training, physical therapy, and home workouts.',
    specs: { 'Levels': '10, 20, 30, 40, 50 lbs (Stackable 150 lbs)', 'Includes': 'Handles, Straps, Door Anchor, Carry Bag' },
    tags: ['sale'],
    reviews: [
      { user: 'Derrick T.', rating: 5, comment: 'Heavy duty carabiners and handles. Fantastic home gym set.', date: '2026-09-12' }
    ]
  },
  {
    id: 'prod-39',
    title: 'HydroFlask 32oz Vacuum Sports Water Bottle',
    category: 'Sports & Fitness',
    price: 38.00,
    originalPrice: 48.00,
    rating: 4.9,
    reviewCount: 145,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    description: 'Pro-grade 18/8 stainless steel bottle with leakproof straw lid and powder coat non-slip grip.',
    detailedDescription: 'TempShield double-wall vacuum insulation keeps icy beverages cold for 24 hours or steaming hot for 12 hours. Sweat-free exterior fits in gym cup holders.',
    specs: { 'Capacity': '32 oz (946ml)', 'Cold Retention': '24 Hours', 'Lid': 'Flex Chug Straw Cap' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Jordan S.', rating: 5, comment: 'Ice cubes still floating after 20 hours in my hot car!', date: '2026-09-22' }
    ]
  },
  {
    id: 'prod-40',
    title: 'ProPulse Deep Tissue Percussion Massage Gun',
    category: 'Sports & Fitness',
    price: 99.00,
    originalPrice: 139.00,
    rating: 4.8,
    reviewCount: 108,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    description: 'Brushless high-torque motor delivering 3200 RPM percussion with 6 interchangeable therapeutic heads.',
    detailedDescription: 'Accelerate muscle recovery, relieve deep lactic acid knots, and increase circulation. QuietGlide noise reduction keeps sound under 40dB with 6 hours of battery.',
    specs: { 'Speed Levels': '30 Adjustable Speeds', 'Amplitude': '12mm Deep Stroke', 'Battery': '2600mAh (6 hours)' },
    tags: ['bestseller', 'sale'],
    reviews: [
      { user: 'Craig R.', rating: 5, comment: 'Instant relief for tight hamstrings and shoulders after lifting.', date: '2026-09-15' }
    ]
  },
  {
    id: 'prod-41',
    title: 'SmartSpeed Digital Calorie Counter Jump Rope',
    category: 'Sports & Fitness',
    price: 22.00,
    originalPrice: 30.00,
    rating: 4.6,
    reviewCount: 65,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    description: 'Dual bearing speed rope with HD backlit counter tracking jumps, elapsed time, and burned calories.',
    detailedDescription: 'Includes both adjustable steel wire cable for outdoor cardio and cordless weighted balls for safe jumping in small apartments.',
    specs: { 'Modes': 'Corded Wire & Cordless Weighted', 'Bearings': '360° Industrial Steel Swivel', 'Display': 'Digital LCD Counter' },
    tags: ['new'],
    reviews: [
      { user: 'Monica F.', rating: 5, comment: 'The cordless mode is brilliant for working out in my bedroom.', date: '2026-09-08' }
    ]
  },
  {
    id: 'prod-42',
    title: 'Kinetic Foam High-Density Trigger Muscle Roller',
    category: 'Sports & Fitness',
    price: 25.00,
    originalPrice: 34.00,
    rating: 4.7,
    reviewCount: 58,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    description: 'Multi-density grid foam roller replicating the fingers and palms of a sports massage therapist.',
    detailedDescription: 'Rigid hollow-core EVA foam retains shape even under 500 lbs of body weight. Ideal for back stretches, IT band rolls, and myofascial release.',
    specs: { 'Material': 'High-Density EVA Foam', 'Dimensions': '13" x 5.5"', 'Weight Limit': '500 lbs' },
    tags: ['sale'],
    reviews: [
      { user: 'Shane B.', rating: 5, comment: 'The texture targets knots perfectly without crushing flat.', date: '2026-09-14' }
    ]
  },
  {
    id: 'prod-43',
    title: 'IronFlex 20kg Adjustable Quick-Lock Dumbbells',
    category: 'Sports & Fitness',
    price: 179.00,
    originalPrice: 229.00,
    rating: 4.9,
    reviewCount: 73,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    description: 'Dial-turn weight selector adjusting from 5kg to 20kg in 2.5kg increments with compact docking tray.',
    detailedDescription: 'Replaces an entire rack of 8 individual dumbbells. Durable laser-cut steel plates with ergonomic knurled textured grip handle.',
    specs: { 'Weight Range': '5kg to 20kg (11 to 44 lbs)', 'Mechanism': 'One-Hand Dial Selector', 'Plates': 'Steel with molded coating' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Trevor D.', rating: 5, comment: 'Smooth weight changes in 1 second. Saves enormous space.', date: '2026-09-20' }
    ]
  },
  {
    id: 'prod-44',
    title: 'TrailRunner Water-Resistant Hydration Vest',
    category: 'Sports & Fitness',
    price: 58.00,
    originalPrice: 75.00,
    rating: 4.7,
    reviewCount: 42,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop&q=80',
    description: 'Bounce-free breathable trail vest with two 500ml front soft flasks and 1.5L back bladder sleeve.',
    detailedDescription: 'Equipped with 8 easy-reach pockets for nutrition gels, smartphone, and trekking poles. 3D air mesh prevents chafing over ultra marathons.',
    specs: { 'Capacity': '5L Storage + 2.5L Liquid', 'Weight': '190g (Ultra-Light)', 'Reflective': '360° Night Trim' },
    tags: ['new'],
    reviews: [
      { user: 'Kelly A.', rating: 5, comment: 'Zero bounce on a 20 mile mountain trail. Fits like a glove.', date: '2026-09-11' }
    ]
  },

  // ==========================================
  // Beauty & Wellness (45 - 50)
  // ==========================================
  {
    id: 'prod-45',
    title: 'SonicWave Whitening Electric Toothbrush',
    category: 'Beauty & Wellness',
    price: 49.00,
    originalPrice: 65.00,
    rating: 4.8,
    reviewCount: 118,
    stock: 36,
    image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&auto=format&fit=crop&q=80',
    description: '40,000 VPM magnetic levitation motor with 5 brushing modes, 2-minute smart timer, and wireless base.',
    detailedDescription: 'Removes up to 10x more plaque than manual toothbrushes. 60-day battery life on a single USB induction charge, complete with travel case and 4 Dupont brush heads.',
    specs: { 'Frequency': '40,000 Vibrations/min', 'Modes': 'Clean, White, Polish, Massage, Sensitive', 'Battery': '60 Days' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Bethany W.', rating: 5, comment: 'Teeth feel dentist-clean every single day.', date: '2026-09-17' }
    ]
  },
  {
    id: 'prod-46',
    title: 'GlowRadiance Rose Quartz Facial Roller & Gua Sha',
    category: 'Beauty & Wellness',
    price: 21.00,
    originalPrice: 29.00,
    rating: 4.7,
    reviewCount: 84,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    description: '100% authentic Brazilian pink rose quartz lymphatic drainage massager with noise-free silicone rollers.',
    detailedDescription: 'Cools and depuffs morning facial tension, boosts serum absorption, and sculpts jawline contours with soothing crystal therapy.',
    specs: { 'Stone': '100% Genuine Brazilian Rose Quartz', 'Frame': 'Reinforced Rose Gold Zinc Alloy', 'Includes': 'Roller + Gua Sha' },
    tags: ['sale'],
    reviews: [
      { user: 'Sonia L.', rating: 5, comment: 'Keep it in the mini fridge, magic for morning eye puffiness.', date: '2026-09-09' }
    ]
  },
  {
    id: 'prod-47',
    title: 'DermaCleanse Silicone Sonic Facial Brush',
    category: 'Beauty & Wellness',
    price: 39.00,
    originalPrice: 52.00,
    rating: 4.8,
    reviewCount: 67,
    stock: 29,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    description: 'Hygienic ultra-soft silicone facial cleansing device with 8000 sonic pulsations and heated massage mode.',
    detailedDescription: '35x more hygienic than standard nylon bristle brushes. Dislodges 99.5% of oil, dirt, and makeup residue while refining pore texture.',
    specs: { 'Waterproof': 'IPX7 100% Submersible', 'Bristles': 'Food-Grade Antibacterial Silicone', 'Pulsations': '8000 RPM' },
    tags: ['new'],
    reviews: [
      { user: 'Tara M.', rating: 5, comment: 'Skin cleared up within two weeks. Gentle on sensitive skin.', date: '2026-09-18' }
    ]
  },
  {
    id: 'prod-48',
    title: 'BotanicalPure Organic Argan & Jojoba Beard Oil',
    category: 'Beauty & Wellness',
    price: 19.50,
    originalPrice: 26.00,
    rating: 4.9,
    reviewCount: 92,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    description: 'Cold-pressed virgin argan, jojoba, and sandalwood beard conditioner eliminating beard itch and flakes.',
    detailedDescription: 'Non-greasy rapid-absorbing formula that tames coarse facial hair, adds natural healthy shine, and nourishes the skin underneath.',
    specs: { 'Volume': '60ml (2 fl oz)', 'Ingredients': '100% Organic Cold-Pressed Oils', 'Scent': 'Subtle Sandalwood & Cedar' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Arthur P.', rating: 5, comment: 'Softens coarse beard hair immediately without feeling greasy.', date: '2026-09-14' }
    ]
  },
  {
    id: 'prod-49',
    title: 'BioShield UV-C Portable Sanitizer Case',
    category: 'Beauty & Wellness',
    price: 36.00,
    originalPrice: 48.00,
    rating: 4.6,
    reviewCount: 51,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    description: 'Medical-grade 260-280nm UV-C ultraviolet disinfection box eliminating 99.9% of bacteria in 3 minutes.',
    detailedDescription: 'Sanitizes smartphones, keys, glasses, face masks, and jewelry. Features automatic safety shut-off when lid opens and built-in aroma diffuser.',
    specs: { 'UV Wavelength': '260-280nm (UV-C)', 'Cycle': '3 Minute Rapid Sanitize', 'Interior': 'Fits phones up to 7 inches' },
    tags: ['sale'],
    reviews: [
      { user: 'Dan R.', rating: 5, comment: 'Peace of mind cleaning phones and keys as soon as I come home.', date: '2026-09-02' }
    ]
  },
  {
    id: 'prod-50',
    title: 'RelaxTherapy Heated Shiatsu Neck & Shoulder Massager',
    category: 'Beauty & Wellness',
    price: 58.00,
    originalPrice: 79.00,
    rating: 4.8,
    reviewCount: 110,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop&q=80',
    description: '3D deep-kneading bidirectional nodes with soothing infrared heat therapy and ergonomic arm straps.',
    detailedDescription: 'Melt away neck, trapezius, and lower back tension from computer work. Features 3 speed intensity levels, automatic reverse direction, and car adapter included.',
    specs: { 'Nodes': '8 Deep Kneading Nodes', 'Heat': 'Infrared 104°F Soothing Heat', 'Auto Shut-Off': '15 Minutes' },
    tags: ['bestseller'],
    reviews: [
      { user: 'Laura G.', rating: 5, comment: 'Heavenly for stiff desk shoulders after working all day.', date: '2026-09-19' }
    ]
  }
];

// Helper to read JSON file safely
function readJSON(file, defaultValue = []) {
  try {
    if (!fs.existsSync(file)) {
      writeJSON(file, defaultValue);
      return defaultValue;
    }
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return defaultValue;
  }
}

// Helper to write JSON file safely
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    return false;
  }
}

// Initialize database with default seed if empty or outdated
function initDB() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    writeJSON(PRODUCTS_FILE, initialProducts);
  } else {
    // If fewer than 50 products exist, update to full 50 products catalog
    const current = readJSON(PRODUCTS_FILE);
    if (!Array.isArray(current) || current.length < 50) {
      writeJSON(PRODUCTS_FILE, initialProducts);
    }
  }

  if (!fs.existsSync(USERS_FILE)) {
    writeJSON(USERS_FILE, []);
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    writeJSON(ORDERS_FILE, []);
  }

  seedDemoUser();
}

function seedDemoUser() {
  try {
    const { hashPassword } = require('./auth');
    const users = readJSON(USERS_FILE, []);
    const demoEmail = 'alex.morgan@zovira.store';
    if (users.some(u => u.email && u.email.toLowerCase() === demoEmail)) {
      return;
    }
    const { salt, hash } = hashPassword('password123');
    users.push({
      id: 'usr_demo_vip',
      name: 'Alex Morgan',
      email: demoEmail,
      salt,
      passwordHash: hash,
      phone: '+1 (555) 349-2041',
      address: '742 Evergreen Terrace, New York, NY',
      role: 'customer',
      createdAt: new Date().toISOString()
    });
    writeJSON(USERS_FILE, users);
  } catch (err) {
    console.warn('[Warning] Could not seed demo user:', err.message);
  }
}

// Database query helpers
const db = {
  // Products
  getProducts: () => readJSON(PRODUCTS_FILE, initialProducts),
  getProductById: (id) => {
    const products = readJSON(PRODUCTS_FILE, initialProducts);
    return products.find(p => p.id === id || String(p.id) === String(id));
  },
  saveProducts: (products) => writeJSON(PRODUCTS_FILE, products),
  updateProductStock: (id, quantityPurchased) => {
    const products = readJSON(PRODUCTS_FILE, initialProducts);
    const index = products.findIndex(p => p.id === id || String(p.id) === String(id));
    if (index !== -1) {
      products[index].stock = Math.max(0, products[index].stock - quantityPurchased);
      writeJSON(PRODUCTS_FILE, products);
      return products[index];
    }
    return null;
  },

  // Users
  getUsers: () => readJSON(USERS_FILE, []),
  getUserById: (id) => {
    const users = readJSON(USERS_FILE, []);
    return users.find(u => u.id === id);
  },
  getUserByEmail: (email) => {
    const users = readJSON(USERS_FILE, []);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser: (user) => {
    const users = readJSON(USERS_FILE, []);
    users.push(user);
    writeJSON(USERS_FILE, users);
    return user;
  },
  updateUser: (id, updateData) => {
    const users = readJSON(USERS_FILE, []);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updateData };
      writeJSON(USERS_FILE, users);
      return users[index];
    }
    return null;
  },

  // Orders
  getOrders: () => readJSON(ORDERS_FILE, []),
  getOrdersByUserId: (userId) => {
    const orders = readJSON(ORDERS_FILE, []);
    return orders.filter(o => o.userId === userId);
  },
  getOrderById: (orderId) => {
    const orders = readJSON(ORDERS_FILE, []);
    return orders.find(o => o.id === orderId);
  },
  createOrder: (order) => {
    const orders = readJSON(ORDERS_FILE, []);
    orders.unshift(order); // Newest first
    writeJSON(ORDERS_FILE, orders);
    return order;
  }
};

// Initialize right away
initDB();

module.exports = db;
