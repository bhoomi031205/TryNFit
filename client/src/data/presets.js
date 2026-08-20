// Curated high-resolution presets for instant 1-click testing
export const PRESET_MODELS = [
  {
    id: 'model-1',
    name: 'Elena',
    gender: 'Female',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    desc: 'Studio portrait, neutral background'
  },
  {
    id: 'model-2',
    name: 'Sophia',
    gender: 'Female',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    desc: 'Frontal stance, modern casual'
  },
  {
    id: 'model-3',
    name: 'Julian',
    gender: 'Male',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    desc: 'Frontal portrait with black hat'
  },
  {
    id: 'model-4',
    name: 'Fatima',
    gender: 'Female',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    desc: 'Studio portrait with headscarf'
  }
];

export const PRESET_GARMENTS = [
  {
    id: 'garment-1',
    name: 'Red Flare Dress',
    category: 'one-pieces',
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80',
    tag: 'One-Piece'
  },
  {
    id: 'garment-2',
    name: 'Leather Moto Jacket',
    category: 'tops',
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80',
    tag: 'Tops'
  },
  {
    id: 'garment-3',
    name: 'Beige Knitwear',
    category: 'tops',
    url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=300&q=80',
    tag: 'Tops'
  },
  {
    id: 'garment-4',
    name: 'Pink Buttoned Shirt',
    category: 'tops',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
    tag: 'Tops'
  }
];

export const CURATED_COMBOS = [
  {
    id: 'combo-1',
    name: 'Elena + Red Flare Dress',
    modelId: 'model-1',
    garmentId: 'garment-1',
    category: 'one-pieces',
    desc: 'Vibrant crimson evening flare dress fitted on Elena'
  },
  {
    id: 'combo-2',
    name: 'Elena + Leather Moto Jacket',
    modelId: 'model-1',
    garmentId: 'garment-2',
    category: 'tops',
    desc: 'Edgy classic biker leather jacket fitted on Elena'
  },
  {
    id: 'combo-3',
    name: 'Elena + Beige Knitwear',
    modelId: 'model-1',
    garmentId: 'garment-3',
    category: 'tops',
    desc: 'Cozy autumn oversized chunky knit pullover on Elena'
  },
  {
    id: 'combo-4',
    name: 'Elena + Pink Buttoned Shirt',
    modelId: 'model-1',
    garmentId: 'garment-4',
    category: 'tops',
    desc: 'Smart-casual pink buttoned blouse fitted on Elena'
  },
  {
    id: 'combo-5',
    name: 'Sophia + Leather Moto Jacket',
    modelId: 'model-2',
    garmentId: 'garment-2',
    category: 'tops',
    desc: 'Contemporary streetwear distressed moto jacket on Sophia'
  },
  {
    id: 'combo-6',
    name: 'Sophia + Beige Knitwear',
    modelId: 'model-2',
    garmentId: 'garment-3',
    category: 'tops',
    desc: 'Soft woven beige knitwear fitted on Sophia'
  },
  {
    id: 'combo-7',
    name: 'Julian + Leather Moto Jacket',
    modelId: 'model-3',
    garmentId: 'garment-2',
    category: 'tops',
    desc: 'Heavyweight biker leather jacket fitted on Julian'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload Your Photo',
    desc: 'Take or upload a clear, front-facing photo showing your upper body or full silhouette.',
    icon: 'User'
  },
  {
    step: '02',
    title: 'Drop Any Clothing Screenshot',
    desc: 'Find any outfit online (Zara, ASOS, Pinterest, etc.) and snap a screenshot or product image.',
    icon: 'Shirt'
  },
  {
    step: '03',
    title: 'AI Neural Fit',
    desc: 'Our generative AI analyzes body contours, fabric drape, and lighting to render your realistic try-on.',
    icon: 'Sparkles'
  }
];
