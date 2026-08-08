import { imageUrl } from '../lib/imageUrl';

const galleryImageData = [
  // 1. Hydraulic Trailer Gallery
  {
    id: 1,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167587/padmashri-agro/gallery/tractor-hydraulic-tipping-trailer-gallery-01.jpg",
    title: "Tractor Hydraulic Tipping Trailer",
    category: "haulage",
    caption: "Heavy Duty 5-Ton Hydraulic Tipping Trailer / Trolley"
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167490/padmashri-agro/gallery/hydraulic-trailer-dump-jack-gallery-01.jpg",
    title: "Hydraulic Trailer Dump Jack",
    category: "haulage",
    caption: "Heavy Duty Hydraulic Tipping Cylinder Mechanism"
  },
  {
    id: 3,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167504/padmashri-agro/gallery/padmashree-heavy-duty-farm-trailer-gallery-01.jpg",
    title: "Finished Heavy Duty Farm Trailer",
    category: "haulage",
    caption: "Factory Finished Trailer in Agriculture Blue Paint"
  },

  // 2. Reversible MB Plough Gallery
  {
    id: 4,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167341/padmashri-agro/gallery/2-bottom-reversible-mb-plough-gallery-01.jpg",
    title: "2 Bottom Reversible MB Plough",
    category: "ploughs",
    caption: "2 Bottom Reversible Mouldboard Plough"
  },
  {
    id: 5,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167365/padmashri-agro/gallery/3-bottom-reversible-mb-plough-gallery-01.jpg",
    title: "3 Bottom Reversible MB Plough",
    category: "ploughs",
    caption: "3 Bottom MB Plough for High HP Tractors"
  },
  {
    id: 6,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167481/padmashri-agro/gallery/hydraulic-reversible-plough-gallery-01.jpg",
    title: "Hydraulic Reversible Plough",
    category: "ploughs",
    caption: "Heavy Duty Hydraulic Reversible Plough with Dual Cylinders"
  },
  {
    id: 7,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167519/padmashri-agro/gallery/plough-attached-to-tractor-gallery-01.jpg",
    title: "Plough Attached to Tractor",
    category: "ploughs",
    caption: "Hydraulic Reversible Plough connected to Tractor Linkage"
  },
  {
    id: 8,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167525/padmashri-agro/gallery/plough-frame-and-shares-gallery-01.jpg",
    title: "Plough Frame & Shares",
    category: "ploughs",
    caption: "Forged High-Carbon Steel Plough Share Points"
  },
  {
    id: 9,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167533/padmashri-agro/gallery/reversible-mechanism-detail-gallery-01.jpg",
    title: "Reversible Mechanism Detail",
    category: "ploughs",
    caption: "Smooth Reversing Pivot Assembly"
  },
  {
    id: 10,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167540/padmashri-agro/gallery/reversible-plow-side-profile-gallery-01.jpg",
    title: "Reversible Plough Side Profile",
    category: "ploughs",
    caption: "14-Inch Mouldboard Curve for Soil Inversion"
  },
  {
    id: 11,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167470/padmashri-agro/gallery/hydraulic-hose-and-valve-connection-01.jpg",
    title: "Hydraulic Hose & Valve Connection",
    category: "ploughs",
    caption: "Dual Wire High Pressure Hydraulic Hose Lines"
  },

  // 3. Fixed MB Plough Gallery
  {
    id: 12,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167331/padmashri-agro/gallery/2-bottom-fixed-mb-plough-gallery-01.jpg",
    title: "2 Bottom Fixed MB Plough",
    category: "ploughs",
    caption: "2 Bottom Fixed Mouldboard Plough (साधा नांगर)"
  },
  {
    id: 13,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167450/padmashri-agro/gallery/fixed-mb-plough-front-linkage-gallery-01.jpg",
    title: "Fixed MB Plough Front Linkage",
    category: "ploughs",
    caption: "Category II Tractor Hitch Mount"
  },
  {
    id: 14,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167457/padmashri-agro/gallery/fixed-plough-stock-gallery-01.jpg",
    title: "Fixed Plough Stock",
    category: "ploughs",
    caption: "Finished Fixed MB Ploughs at Workshop"
  },

  // 4. Sugarcane Ridger Gallery
  {
    id: 15,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167562/padmashri-agro/gallery/sugarcane-inter-row-cultivator-gallery-01.jpg",
    title: "Sugarcane Inter-Row Cultivator",
    category: "tillage",
    caption: "Sugarcane Ridger / Earthing-up Cultivator (उसाची बांधणी)"
  },
  {
    id: 16,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167578/padmashri-agro/gallery/sugarcane-ridger-field-operation-gallery-01.jpg",
    title: "Sugarcane Ridger Field Operation",
    category: "tillage",
    caption: "In-field sugarcane furrowing and root earthing-up"
  },
  {
    id: 17,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167553/padmashri-agro/gallery/sugarcane-furrowing-wings-gallery-01.jpg",
    title: "Sugarcane Furrowing Wings",
    category: "tillage",
    caption: "Screw adjustable earthing wings detail"
  },

  // 5. Tractor Ridger & Bund Maker Gallery
  {
    id: 18,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167387/padmashri-agro/gallery/3-row-tractor-ridger-gallery-01.jpg",
    title: "3-Row Tractor Ridger",
    category: "tillage",
    caption: "3-Row Tractor Ridger / Bund Maker / Furrower"
  },
  {
    id: 19,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167352/padmashri-agro/gallery/2-row-adjustable-ridger.jpg",
    title: "2-Row Adjustable Ridger",
    category: "tillage",
    caption: "2-Row Adjustable Ridger for Row Crop Planting"
  },
  {
    id: 20,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167417/padmashri-agro/gallery/bund-maker-side-wings-gallery-01.jpg",
    title: "Bund Maker Side Wings",
    category: "tillage",
    caption: "Heavy Duty Side Wings for Field Bund Creation"
  },
  {
    id: 21,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167408/padmashri-agro/gallery/bund-maker-frame-type.jpg",
    title: "Bund Maker Frame Type",
    category: "tillage",
    caption: "Reinforced Box Frame Construction"
  },

  // 6. Duckfoot Cultivator Gallery
  {
    id: 22,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167399/padmashri-agro/gallery/5-tine-duckfoot-cultivator.jpg",
    title: "5-Tine Duckfoot Cultivator",
    category: "tillage",
    caption: "5-Tine Duckfoot Cultivator / Sweep Cultivator (डकफूट कोळपे)"
  },
  {
    id: 23,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167434/padmashri-agro/gallery/duckfoot-sweep-cultivator.jpg",
    title: "Duckfoot Sweep Cultivator",
    category: "tillage",
    caption: "Triangular Sweep Blades for Shallow Weed Slicing"
  },

  // 7. Seed cum Fertilizer Drill Gallery
  {
    id: 24,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167596/padmashri-agro/gallery/tractor-mounted-seed-drill.jpg",
    title: "Tractor Mounted Seed Drill",
    category: "sowing",
    caption: "Automatic Seed cum Fertilizer Drill Machine"
  },
  {
    id: 25,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167426/padmashri-agro/gallery/dual-chamber-seed-fertilizer-box.jpg",
    title: "Dual Chamber Seed & Fertilizer Box",
    category: "sowing",
    caption: "Metering Box for Seed & Fertilizer Sowing"
  },

  // 8. Land Leveler Blade Gallery
  {
    id: 26,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167462/padmashri-agro/gallery/heavy-duty-land-leveler-blade.jpg",
    title: "Heavy Duty Land Leveler Blade",
    category: "tillage",
    caption: "Tractor Mounted Land Leveler / Scraper Blade"
  },
  {
    id: 27,
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167497/padmashri-agro/gallery/land-leveler-turntable-index-plate.jpg",
    title: "Land Leveler Turntable Index Plate",
    category: "tillage",
    caption: "360-Degree Rotation Index Turntable for Pushing/Pulling Soil"
  }
];

export const galleryImages = galleryImageData.map((image) => ({
  ...image,
  url: imageUrl(image.url)
}));
