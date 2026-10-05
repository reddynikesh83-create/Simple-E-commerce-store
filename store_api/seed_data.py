"""
Initial seed data containing 12 high-quality catalog products and customer reviews.
"""

from .models import Product, Review

INITIAL_PRODUCTS = [
    {
        "id": "prod-1",
        "title": "Aura Wireless Noise-Canceling Headphones",
        "category": "Electronics",
        "price": 199.99,
        "original_price": 249.99,
        "rating": 4.8,
        "review_count": 142,
        "stock": 24,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "description": "Immersive sound with industry-leading hybrid active noise cancellation and 40-hour battery life.",
        "detailed_description": "The Aura Wireless Headphones deliver studio-grade acoustics paired with adaptive noise reduction. Crafted with memory foam ear cushions and an ultra-lightweight magnesium alloy frame for all-day comfort. Features Bluetooth 5.3 multi-point pairing, transparency mode, and ultra-fast USB-C quick charge (5 mins = 3 hours playback).",
        "specs": {
            "Driver Size": "40mm Titanium Dome",
            "Battery Life": "Up to 40 hours (ANC on)",
            "Connectivity": "Bluetooth 5.3, 3.5mm AUX",
            "Charging": "USB-C Fast Charging",
            "Weight": "250g"
        },
        "tags": ["bestseller", "sale"],
        "reviews": [
            {"user": "Alex M.", "rating": 5, "comment": "Phenomenal sound clarity and ANC rivals top tier brands!", "date": "2026-09-15"},
            {"user": "Sarah K.", "rating": 4, "comment": "Super comfortable for long coding sessions.", "date": "2026-09-20"}
        ]
    },
    {
        "id": "prod-2",
        "title": "Horizon Pro Smartwatch & Fitness Tracker",
        "category": "Electronics",
        "price": 149.50,
        "original_price": 179.99,
        "rating": 4.6,
        "review_count": 98,
        "stock": 18,
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        "description": "Always-On AMOLED display, dual-band GPS, SpO2 blood oxygen, and comprehensive wellness monitoring.",
        "detailed_description": "Engineered for athletes and active lifestyles, the Horizon Pro combines elegance with durability. Waterproof up to 50 meters, featuring 100+ workout modes, continuous heart rate analysis, sleep staging, and smart notification alerts directly on your wrist.",
        "specs": {
            "Display": "1.43 inch AMOLED (466x466)",
            "Battery Life": "Up to 10 days",
            "Water Resistance": "5 ATM (50m)",
            "Sensors": "Optical Heart Rate, SpO2, Accelerometer",
            "Compatibility": "iOS & Android"
        },
        "tags": ["new", "sale"],
        "reviews": [
            {"user": "David R.", "rating": 5, "comment": "Battery lasts more than a week easily. Great screen!", "date": "2026-09-18"}
        ]
    },
    {
        "id": "prod-3",
        "title": "Vortex RGB Mechanical Gaming Keyboard",
        "category": "Electronics",
        "price": 89.99,
        "original_price": 109.99,
        "rating": 4.7,
        "review_count": 86,
        "stock": 35,
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
        "description": "Hot-swappable linear red switches with per-key RGB backlighting and PBT double-shot keycaps.",
        "detailed_description": "Elevate your gaming and typing precision. Features custom acoustic dampening silicone foam, aircraft-grade aluminum top plate, and full N-key rollover for zero ghosting.",
        "specs": {
            "Switch Type": "Hot-Swappable Custom Linear Red",
            "Layout": "75% Compact (84 Keys)",
            "Keycaps": "Double-shot PBT Cherry Profile",
            "Connection": "Detachable braided Type-C cable",
            "RGB": "16.8M colors per-key dynamic backlighting"
        },
        "tags": ["bestseller"],
        "reviews": [
            {"user": "Liam T.", "rating": 5, "comment": "The typing sound is so deep and creamy. Highly recommended!", "date": "2026-08-30"}
        ]
    },
    {
        "id": "prod-4",
        "title": "Apex 4K Ultra HD Action Camera",
        "category": "Electronics",
        "price": 229.00,
        "original_price": 289.00,
        "rating": 4.5,
        "review_count": 64,
        "stock": 12,
        "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
        "description": "Shoot breathtaking 4K 60fps video with 6-axis gyro stabilization and dual touchscreens.",
        "detailed_description": "Capture your wildest outdoor adventures. Rugged, waterproof down to 33ft without an external case, with voice control, time-lapse, 8x slow motion, and live streaming capabilities.",
        "specs": {
            "Video Resolution": "4K at 60fps / 1080p at 240fps",
            "Photo Resolution": "20MP RAW & JPG",
            "Stabilization": "HyperSmooth 6-Axis Electronic Gyro",
            "Display": "Front selfie screen + 2.27\" Rear Touchscreen",
            "Waterproof": "10m (33ft) native"
        },
        "tags": ["sale"],
        "reviews": [
            {"user": "Chris B.", "rating": 4, "comment": "Video stabilization is mind-blowing.", "date": "2026-09-02"}
        ]
    },
    {
        "id": "prod-5",
        "title": "Artisan Full-Grain Leather Messenger Bag",
        "category": "Fashion",
        "price": 119.00,
        "original_price": 159.00,
        "rating": 4.9,
        "review_count": 112,
        "stock": 15,
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
        "description": "Handcrafted genuine leather messenger bag with padded 15.6\" laptop compartment and antique brass buckles.",
        "detailed_description": "Constructed from premium top-grain cowhide leather that develops a rich, distinguished patina over time. Designed with reinforced stitching, padded shoulder straps, quick-access magnetic snap closures, and multiple interior organizer slots.",
        "specs": {
            "Material": "100% Full-grain buffalo leather",
            "Dimensions": "16\" W x 12\" H x 4.5\" D",
            "Laptop Sleeve": "Fits up to 15.6 inch laptops",
            "Hardware": "Antique Solid Brass Fittings",
            "Strap": "Adjustable padded leather shoulder strap"
        },
        "tags": ["bestseller"],
        "reviews": [
            {"user": "Mark S.", "rating": 5, "comment": "The leather smell and craftsmanship are exceptional.", "date": "2026-09-12"}
        ]
    },
    {
        "id": "prod-6",
        "title": "Minimalist Heavyweight Cotton Hoodie",
        "category": "Fashion",
        "price": 59.00,
        "original_price": 75.00,
        "rating": 4.7,
        "review_count": 89,
        "stock": 40,
        "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
        "description": "450 GSM luxury brushed organic cotton hoodie with tailored relaxed drape and double-lined hood.",
        "detailed_description": "The ultimate essential pullover hoodie. Pre-shrunk French terry weave providing warmth, breathability, and structural durability. No loud logos—just pure silhouette and timeless elegance.",
        "specs": {
            "Material": "100% Organic Ring-spun Combed Cotton (450 GSM)",
            "Fit": "Contemporary Relaxed Fit",
            "Features": "Kangaroo pouch, ribbed cuffs and hem, double-lined hood",
            "Care": "Machine wash cold, line dry recommended"
        },
        "tags": ["new"],
        "reviews": [
            {"user": "Jessica P.", "rating": 5, "comment": "Thick, super cozy, and holds its shape after washes.", "date": "2026-09-19"}
        ]
    },
    {
        "id": "prod-7",
        "title": "AeroStride Lightweight Running Shoes",
        "category": "Fashion",
        "price": 85.00,
        "original_price": 110.00,
        "rating": 4.6,
        "review_count": 77,
        "stock": 28,
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        "description": "High-energy return responsive cushioning with engineered breathable mesh upper for daily miles.",
        "detailed_description": "Engineered for runners seeking speed, cushion, and agility. The responsive nitrogen-infused foam midsole absorbs ground impact while giving explosive toe-offs. Continental rubber outsole delivers maximum grip across wet and dry pavement.",
        "specs": {
            "Upper": "Engineered Jacquard Breathable Mesh",
            "Midsole": "Nitrogen-Infused Energy Foam",
            "Weight": "210g (Men size 9)",
            "Heel Drop": "8mm"
        },
        "tags": ["sale"],
        "reviews": [
            {"user": "Nathan L.", "rating": 5, "comment": "Like walking on clouds! Shaved 30 seconds off my 5k.", "date": "2026-09-24"}
        ]
    },
    {
        "id": "prod-8",
        "title": "Voyager Polarized Titanium Sunglasses",
        "category": "Fashion",
        "price": 48.00,
        "original_price": 65.00,
        "rating": 4.8,
        "review_count": 53,
        "stock": 32,
        "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
        "description": "Ultra-lightweight titanium frames with HD polarized UV400 anti-glare scratch-resistant lenses.",
        "detailed_description": "Timeless modern geometric aviator silhouette. Built with memory flex titanium hinges that effortlessly contour to your face without pinching.",
        "specs": {
            "Lens Protection": "100% UV400 & Polarized Filter",
            "Frame": "Aerospace Grade Beta-Titanium",
            "Nose Pads": "Hypoallergenic Silicone Pads",
            "Weight": "18 grams"
        },
        "tags": ["bestseller"],
        "reviews": [
            {"user": "Emily W.", "rating": 5, "comment": "So light you forget you have them on. Crystal clear lenses.", "date": "2026-08-25"}
        ]
    },
    {
        "id": "prod-9",
        "title": "Nordic Ceramic Pour-Over Coffee Brewer",
        "category": "Home & Living",
        "price": 36.00,
        "original_price": 48.00,
        "rating": 4.9,
        "review_count": 68,
        "stock": 22,
        "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
        "description": "Hand-glazed ceramic dripper with thermal heat retention and matching insulated borosilicate carafe.",
        "detailed_description": "Master the art of manual coffee brewing. The interior spiral ribbing regulates extraction flow rate for rich, balanced aromatic coffee notes every single morning.",
        "specs": {
            "Material": "High-fire stoneware ceramic & heat-proof borosilicate glass",
            "Capacity": "600ml (2-4 cups)",
            "Filter Compatibility": "Standard V60 02 paper filters",
            "Dishwasher Safe": "Yes"
        },
        "tags": ["bestseller"],
        "reviews": [
            {"user": "Dan B.", "rating": 5, "comment": "Every coffee lover needs this. Beautiful countertop piece too.", "date": "2026-09-08"}
        ]
    },
    {
        "id": "prod-10",
        "title": "AromaPure Ultrasonic Ambient Diffuser",
        "category": "Home & Living",
        "price": 32.50,
        "original_price": 42.00,
        "rating": 4.7,
        "review_count": 91,
        "stock": 30,
        "image": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
        "description": "Quiet ultrasonic cool mist aromatherapy diffuser with 7 ambient warm lighting modes and auto shut-off.",
        "detailed_description": "Transform any room into a tranquil spa retreat. Uses high-frequency sound waves to atomize water and essential oils without heat, keeping botanical therapeutic compounds intact.",
        "specs": {
            "Water Tank": "300ml (Up to 12 hours continuous mist)",
            "Noise Level": "Whisper-quiet (<20dB)",
            "Timer Modes": "1H / 3H / 6H / Continuous ON",
            "Lighting": "7 calming LED mood colors with dimming"
        },
        "tags": ["sale"],
        "reviews": [
            {"user": "Rachel Z.", "rating": 5, "comment": "Love the soothing mist and timer feature before sleep.", "date": "2026-09-11"}
        ]
    },
    {
        "id": "prod-11",
        "title": "Lumina Minimalist Desk Lamp & Fast Qi Charger",
        "category": "Home & Living",
        "price": 52.00,
        "original_price": 69.00,
        "rating": 4.8,
        "review_count": 45,
        "stock": 19,
        "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
        "description": "Eye-caring anti-blue light LED bar with 5 color temperatures, touch slider dimmer, and 15W wireless charging base.",
        "detailed_description": "The centerpiece for any productive workspace. Glare-free asymmetric optical design illuminates your desk without screen reflection. Built-in 15W Qi fast charging pad keeps your smartphone powered.",
        "specs": {
            "Brightness": "Up to 900 Lumens (CRI > 95)",
            "Color Temp": "2700K - 6500K (5 presets)",
            "Wireless Charger": "15W Fast Qi Wireless Base + 5V USB output",
            "Arm Adjustability": "180° foldable multi-angle hinge"
        },
        "tags": ["new"],
        "reviews": [
            {"user": "Henry T.", "rating": 5, "comment": "Cleared clutter from my desk. The wireless charging base is so handy.", "date": "2026-09-22"}
        ]
    },
    {
        "id": "prod-12",
        "title": "ErgoCloud Memory Foam Lumbar Support Cushion",
        "category": "Home & Living",
        "price": 39.99,
        "original_price": 49.99,
        "rating": 4.6,
        "review_count": 104,
        "stock": 45,
        "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
        "description": "Orthopedic contoured high-density memory foam cushion with breathable 3D mesh cover and dual adjustable straps.",
        "detailed_description": "Alleviate back strain and improve spine alignment during long hours at your desk or in your car. Features temperature-neutral memory foam that molds to your unique lumbar curve.",
        "specs": {
            "Foam": "100% Pure High-Density Slow-Rebound Memory Foam",
            "Cover": "Removable & Machine Washable 3D Breathable Mesh",
            "Straps": "Dual Heavy-duty Elastic Extensions with quick clips",
            "Dimensions": "17.3\" x 15\" x 4.7\""
        },
        "tags": ["bestseller"],
        "reviews": [
            {"user": "Vikram S.", "rating": 5, "comment": "Cured my lower back ache within 3 days. A must-have for programmers.", "date": "2026-09-14"}
        ]
    }
]

def seed_database(force=False):
    """Populates the database with initial products and reviews."""
    if not force and Product.objects.exists():
        return 0

    count = 0
    for p_data in INITIAL_PRODUCTS:
        reviews = p_data.get('reviews', [])
        product, created = Product.objects.update_or_create(
            id=p_data['id'],
            defaults={
                'title': p_data['title'],
                'category': p_data['category'],
                'price': p_data['price'],
                'original_price': p_data.get('original_price'),
                'rating': p_data.get('rating', 5.0),
                'review_count': p_data.get('review_count', len(reviews)),
                'stock': p_data.get('stock', 10),
                'image': p_data['image'],
                'description': p_data['description'],
                'detailed_description': p_data.get('detailed_description', ''),
                'specs': p_data.get('specs', {}),
                'tags': p_data.get('tags', []),
            }
        )
        if created:
            count += 1

        for r in reviews:
            Review.objects.get_or_create(
                product=product,
                user_name=r['user'],
                comment=r['comment'],
                defaults={
                    'rating': r['rating'],
                    'review_date': r['date']
                }
            )

    return count
