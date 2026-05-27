/* ============================================================
   PDBench — References for methods and generators
   Centralized so we don't repeat paper URLs across 8 JSON files.
   ============================================================ */

window.PDBENCH_REFS = {
  // ---- Defense methods ----
  methods: {
    "PGD": {
      full: "Towards Deep Learning Models Resistant to Adversarial Attacks",
      authors: "Madry et al., 2017",
      url: "https://arxiv.org/abs/1706.06083"
    },
    "Disrupting": {
      full: "Disrupting Deepfakes: Adversarial Attacks Against Conditional Image Translation Networks and Facial Manipulation Systems",
      authors: "Ruiz et al., ECCV 2020",
      url: "https://arxiv.org/abs/2003.01279"
    },
    "DF-RAP": {
      full: "DF-RAP: A Robust Adversarial Perturbation for Defending against Deepfakes in Real-world Social Network Scenarios",
      authors: "Qu et al., IEEE TIFS 2024",
      url: "https://ieeexplore.ieee.org/document/10458678"
    },
    "Anti-Forgery": {
      full: "Anti-Forgery: Towards a Stealthy and Robust DeepFake Disruption Attack via Adversarial Perceptual-aware Perturbations",
      authors: "Wang et al., 2022",
      url: "https://arxiv.org/abs/2206.00477"
    },
    "Latent Attack": {
      full: "LEAT: Towards Robust Deepfake Disruption in Real-world Scenarios via Latent Ensemble Attack",
      authors: "Shim & Yoon, Expert Systems with Applications 2025",
      url: "https://arxiv.org/abs/1702.06832"
    },
    "SCOL": {
      full: "SCOL: Style Code Orchestration in Latent Space for Proactive Face-swapping Defense",
      authors: "Lee et al., ACM MM 2025",
      url: "https://dl.acm.org/doi/10.1145/3746027.3755344"
    },
    "NullSwap": {
      full: "NullSwap: Proactive Identity Cloaking Against Deepfake Face Swapping",
      authors: "Wang et al., ICCV 2025",
      url: "https://arxiv.org/abs/2503.18678"
    }
  },

  // ---- Deepfake generators ----
  generators: {
    "StarGAN": {
      full: "StarGAN: Unified Generative Adversarial Networks for Multi-Domain Image-to-Image Translation",
      authors: "Choi et al., CVPR 2018",
      url: "https://arxiv.org/abs/1711.09020"
    },
    "StyleCLIP": {
      full: "StyleCLIP: Text-Driven Manipulation of StyleGAN Imagery",
      authors: "Patashnik et al., ICCV 2021",
      url: "https://arxiv.org/abs/2103.17249"
    },
    "DiffAE": {
      full: "Diffusion Autoencoders: Toward a Meaningful and Decodable Representation",
      authors: "Preechakul et al., CVPR 2022",
      url: "https://arxiv.org/abs/2111.15640"
    },
    "SimSwap": {
      full: "SimSwap: An Efficient Framework for High Fidelity Face Swapping",
      authors: "Chen et al., ACM MM 2020",
      url: "https://arxiv.org/abs/2106.06340"
    },
    "pSp-mix": {
      full: "Encoding in Style: a StyleGAN Encoder for Image-to-Image Translation (pSp)",
      authors: "Richardson et al., CVPR 2021",
      url: "https://arxiv.org/abs/2008.00951"
    },
    "BlendFace": {
      full: "BlendFace: Re-designing Identity Encoders for Face-Swapping",
      authors: "Shiohara et al., ICCV 2023",
      url: "https://arxiv.org/abs/2307.10854"
    },
    "DiffSwap": {
      full: "DiffSwap: High-Fidelity and Controllable Face Swapping via 3D-Aware Masked Diffusion",
      authors: "Zhao et al., CVPR 2023",
      url: "https://openaccess.thecvf.com/content/CVPR2023/papers/Zhao_DiffSwap_High-Fidelity_and_Controllable_Face_Swapping_via_3D-Aware_Masked_Diffusion_CVPR_2023_paper.pdf"
    },
    "DiffFace": {
      full: "DiffFace: Diffusion-based Face Swapping with Facial Guidance",
      authors: "Kim et al., Pattern Recognition 2025",
      url: "https://arxiv.org/abs/2212.13344"
    }
  },

  // ---- Datasets ----
  datasets: {
    "CelebA-HQ": {
      full: "Progressive Growing of GANs for Improved Quality, Stability, and Variation",
      authors: "Karras et al., 2017",
      url: "https://arxiv.org/abs/1710.10196"
    },
    "FFHQ": {
      full: "A Style-Based Generator Architecture for Generative Adversarial Networks",
      authors: "Karras et al., CVPR 2019",
      url: "https://arxiv.org/abs/1812.04948"
    },
    "VGGFace2-HQ": {
      full: "VGGFace2: A Dataset for Recognising Faces across Pose and Age",
      authors: "Cao et al., FG 2018",
      url: "https://arxiv.org/abs/1710.08092"
    }
  }
};
