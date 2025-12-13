const mysql = require('mysql2/promise');

async function createGPUComputeProduct() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Innov8t!veAI@2025',
    database: 'cloud4india_db'
  });

  try {
    console.log('Creating GPU Compute product...');

    // 1. Insert the product
    const [productResult] = await connection.execute(
      `INSERT INTO products (name, description, category, color, border_color, route, enable_single_page, is_visible, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        'GPU Compute',
        'High-performance NVIDIA GPUs for AI/ML workloads, deep learning, and computational research',
        'Compute',
        '#10b981',
        '#059669',
        'gpu-compute',
        1,
        1
      ]
    );

    const productId = productResult.insertId;
    console.log(`Product created with ID: ${productId}`);

    // 2. Create sections
    const sections = [
      {
        section_type: 'hero',
        title: 'GPU Compute - Accelerate Your AI/ML Workloads',
        description: 'Enterprise-grade NVIDIA GPU instances optimized for artificial intelligence, machine learning, deep learning, and high-performance computing workloads.',
        order_index: 0,
        is_visible: 1
      },
      {
        section_type: 'features',
        title: 'Key Features',
        description: 'Powerful GPU capabilities designed for demanding computational workloads',
        order_index: 1,
        is_visible: 1
      },
      {
        section_type: 'pricing',
        title: 'Flexible Pricing Plans',
        description: 'Choose the perfect GPU configuration for your workload and budget',
        order_index: 2,
        is_visible: 1
      },
      {
        section_type: 'specifications',
        title: 'Technical Specifications',
        description: 'Enterprise-grade GPU hardware with industry-leading performance',
        order_index: 3,
        is_visible: 1
      },
      {
        section_type: 'security',
        title: 'Security & Compliance',
        description: 'GPU instances with enterprise-grade security and compliance certifications',
        order_index: 4,
        is_visible: 1,
        content: JSON.stringify({
          title: 'Security Features',
          features: [
            'Isolated GPU resources',
            'Encrypted storage and network',
            'VPC and firewall protection',
            'SOC 2 & ISO 27001 certified',
            'Regular security updates',
            'Data residency compliance'
          ]
        })
      },
      {
        section_type: 'support',
        title: 'Expert Support & SLA',
        description: '24/7 technical support from GPU and AI/ML specialists',
        order_index: 5,
        is_visible: 1
      },
      {
        section_type: 'migration',
        title: 'Easy Migration & Setup',
        description: 'Seamlessly migrate your AI/ML workloads to our GPU infrastructure',
        order_index: 6,
        is_visible: 1
      },
      {
        section_type: 'use_cases',
        title: 'Perfect For',
        description: 'Ideal for a wide range of GPU-accelerated applications and workloads',
        order_index: 7,
        is_visible: 1
      },
      {
        section_type: 'cta',
        title: 'Ready to Accelerate Your AI Workloads?',
        description: 'Get started with GPU Compute today and experience lightning-fast performance',
        order_index: 8,
        is_visible: 1
      }
    ];

    for (const section of sections) {
      const [sectionResult] = await connection.execute(
        `INSERT INTO product_sections (product_id, section_type, title, description, order_index, is_visible, content, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [productId, section.section_type, section.title, section.description, section.order_index, section.is_visible, section.content || null]
      );
      
      const sectionId = sectionResult.insertId;
      console.log(`Created section: ${section.section_type} (ID: ${sectionId})`);

      // 3. Add items for each section
      if (section.section_type === 'hero') {
        // Hero feature bullets
        const heroFeatures = [
          { title: 'Latest NVIDIA GPUs (A100, V100, T4)', order: 0 },
          { title: 'Pre-configured ML frameworks (TensorFlow, PyTorch)', order: 1 },
          { title: 'Scale from 1 to 8 GPUs per instance', order: 2 }
        ];
        
        for (const feature of heroFeatures) {
          await connection.execute(
            `INSERT INTO product_section_items (section_id, item_type, title, order_index, is_visible, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [sectionId, 'feature', feature.title, feature.order, 1]
          );
        }

        // Hero stats
        const heroStats = [
          { value: '10x', label: 'Faster Training', order: 3 },
          { value: '99.95%', label: 'Uptime SLA', order: 4 },
          { value: '24/7', label: 'GPU Support', order: 5 }
        ];
        
        for (const stat of heroStats) {
          await connection.execute(
            `INSERT INTO product_section_items (section_id, item_type, value, label, order_index, is_visible, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [sectionId, 'stat', stat.value, stat.label, stat.order, 1]
          );
        }

        // Hero CTA
        await connection.execute(
          `INSERT INTO product_section_items (section_id, item_type, title, description, value, order_index, is_visible, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [sectionId, 'cta_primary', 'Launch GPU Console', 'Start Training Now', 'Deploy in 60 seconds', 6, 1]
        );
      }

      if (section.section_type === 'features') {
        const features = [
          {
            title: 'NVIDIA GPU Acceleration',
            description: 'Latest NVIDIA A100, V100, and T4 GPUs with Tensor Cores for unprecedented AI/ML performance',
            icon: 'CpuChipIcon',
            order: 0
          },
          {
            title: 'Pre-installed ML Frameworks',
            description: 'TensorFlow, PyTorch, CUDA toolkit, cuDNN pre-configured and ready to use out of the box',
            icon: 'CircleStackIcon',
            order: 1
          },
          {
            title: 'Scalable GPU Clusters',
            description: 'Scale from single GPU to multi-GPU clusters for distributed training and inference',
            icon: 'ChartBarIcon',
            order: 2
          },
          {
            title: 'High-Speed NVMe Storage',
            description: 'Ultra-fast NVMe SSD storage for rapid dataset loading and model checkpointing',
            icon: 'CircleStackIcon',
            order: 3
          },
          {
            title: 'Low-Latency Networking',
            description: '100 Gbps RDMA networking for efficient multi-GPU communication and data transfer',
            icon: 'GlobeAltIcon',
            order: 4
          },
          {
            title: 'Jupyter & MLOps Tools',
            description: 'Integrated Jupyter notebooks, MLflow, and Kubeflow for seamless ML workflow',
            icon: 'ServerIcon',
            order: 5
          }
        ];

        for (const feature of features) {
          await connection.execute(
            `INSERT INTO product_section_items (section_id, item_type, title, description, icon, order_index, is_visible, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [sectionId, 'feature', feature.title, feature.description, feature.icon, feature.order, 1]
          );
        }
      }

      if (section.section_type === 'pricing') {
        const pricingPlans = [
          {
            title: 'Tesla T4',
            content: {
              specifications: ['1x NVIDIA T4 GPU', '16GB GPU Memory', '8 vCPUs', '32GB RAM', '500GB NVMe SSD'],
              features: ['FP16/INT8 precision', 'Inference optimized', '24/7 Support', 'Pre-configured ML stack'],
              price: '₹15,000/month',
              buttonText: 'Deploy Now',
              buttonColor: 'orange'
            },
            order: 0
          },
          {
            title: 'Tesla V100',
            content: {
              specifications: ['1x NVIDIA V100 GPU', '32GB GPU Memory', '16 vCPUs', '64GB RAM', '1TB NVMe SSD'],
              features: ['Tensor Core acceleration', 'Training & inference', 'Priority support', 'Snapshot backups'],
              price: '₹45,000/month',
              buttonText: 'Deploy Now',
              buttonColor: 'orange'
            },
            order: 1
          },
          {
            title: 'A100 40GB',
            content: {
              specifications: ['1x NVIDIA A100 GPU', '40GB GPU Memory', '32 vCPUs', '128GB RAM', '2TB NVMe SSD'],
              features: ['Latest Ampere architecture', 'Multi-instance GPU', 'Dedicated support', 'Auto-scaling ready'],
              price: '₹95,000/month',
              buttonText: 'Deploy Now',
              buttonColor: 'orange'
            },
            order: 2
          },
          {
            title: 'A100 80GB',
            content: {
              specifications: ['1x NVIDIA A100 80GB', '80GB GPU Memory', '64 vCPUs', '256GB RAM', '4TB NVMe SSD'],
              features: ['Largest GPU memory', 'Large model training', '24/7 dedicated engineer', 'Custom configurations'],
              price: '₹1,75,000/month',
              buttonText: 'Contact Sales',
              buttonColor: 'green'
            },
            order: 3
          }
        ];

        for (const plan of pricingPlans) {
          await connection.execute(
            `INSERT INTO product_section_items (section_id, item_type, title, content, order_index, is_visible, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [sectionId, 'pricing_plan', plan.title, JSON.stringify(plan.content), plan.order, 1]
          );
        }
      }

      if (section.section_type === 'specifications') {
        const specs = [
          {
            title: 'GPU Options',
            icon: 'CpuChipIcon',
            content: {
              features: [
                'NVIDIA A100 80GB PCIe/SXM',
                'NVIDIA A100 40GB PCIe',
                'NVIDIA V100 32GB SXM2',
                'NVIDIA Tesla T4 16GB'
              ]
            },
            order: 0
          },
          {
            title: 'Compute Power',
            icon: 'ChartBarIcon',
            content: {
              features: [
                'Up to 312 TFLOPS FP16',
                '624 TFLOPS with sparsity',
                'Tensor Core acceleration',
                'Support for TF32, FP64, INT8'
              ]
            },
            order: 1
          },
          {
            title: 'Memory & Storage',
            icon: 'CircleStackIcon',
            content: {
              features: [
                'Up to 256GB system RAM',
                'Up to 80GB GPU memory',
                'NVMe SSD up to 8TB',
                'High-bandwidth HBM2e'
              ]
            },
            order: 2
          },
          {
            title: 'Networking',
            icon: 'GlobeAltIcon',
            content: {
              features: [
                '100 Gbps InfiniBand',
                'RDMA over Converged Ethernet',
                'GPUDirect support',
                'Private VPC networking'
              ]
            },
            order: 3
          },
          {
            title: 'Software Stack',
            icon: 'ServerIcon',
            content: {
              features: [
                'CUDA 11.8/12.0 Toolkit',
                'cuDNN, TensorRT, NCCL',
                'Docker with GPU support',
                'Kubernetes GPU scheduling'
              ]
            },
            order: 4
          },
          {
            title: 'Operating Systems',
            icon: 'ServerIcon',
            content: {
              features: [
                'Ubuntu 20.04/22.04 LTS',
                'CentOS 7/8',
                'Rocky Linux 8/9',
                'Custom OS images'
              ]
            },
            order: 5
          }
        ];

        for (const spec of specs) {
          await connection.execute(
            `INSERT INTO product_section_items (section_id, item_type, title, icon, content, order_index, is_visible, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [sectionId, 'specification', spec.title, spec.icon, JSON.stringify(spec.content), spec.order, 1]
          );
        }
      }

      if (section.section_type === 'support') {
        const supportChannels = [
          {
            title: '24/7 GPU Expert Support',
            description: 'Direct access to GPU and ML engineers via phone, email, and chat',
            icon: 'UsersIcon',
            order: 0
          },
          {
            title: '99.95% Uptime SLA',
            description: 'Industry-leading uptime guarantee with proactive monitoring',
            icon: 'ShieldCheckIcon',
            order: 1
          },
          {
            title: 'Dedicated ML Engineers',
            description: 'Premium plans include dedicated engineers for optimization',
            icon: 'UsersIcon',
            order: 2
          },
          {
            title: 'Knowledge Base & Tutorials',
            description: 'Extensive documentation and GPU optimization guides',
            icon: 'DocumentTextIcon',
            order: 3
          }
        ];

        for (const channel of supportChannels) {
          await connection.execute(
            `INSERT INTO product_section_items (section_id, item_type, title, description, icon, order_index, is_visible, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [sectionId, 'support_channel', channel.title, channel.description, channel.icon, channel.order, 1]
          );
        }
      }

      if (section.section_type === 'migration') {
        const migrationSteps = [
          {
            title: 'Assessment & Planning',
            description: 'Our team analyzes your current ML infrastructure and creates a migration roadmap',
            order: 0
          },
          {
            title: 'Data & Model Transfer',
            description: 'Secure, high-speed transfer of datasets and trained models to GPU instances',
            order: 1
          },
          {
            title: 'Training & Optimization',
            description: 'Free training on GPU optimization and best practices for your team',
            order: 2
          }
        ];

        for (const step of migrationSteps) {
          await connection.execute(
            `INSERT INTO product_section_items (section_id, item_type, title, description, order_index, is_visible, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [sectionId, 'step', step.title, step.description, step.order, 1]
          );
        }
      }

      if (section.section_type === 'use_cases') {
        const useCases = [
          {
            title: 'Deep Learning & AI Research',
            description: 'Train complex neural networks and conduct cutting-edge AI research',
            icon: 'CpuChipIcon',
            content: {
              benefits: [
                '10x faster training than CPUs',
                'Support for large transformer models',
                'Multi-GPU distributed training',
                'Jupyter notebook environment'
              ]
            },
            order: 0
          },
          {
            title: 'Computer Vision',
            description: 'Process images and videos for object detection, segmentation, and recognition',
            icon: 'EyeIcon',
            content: {
              benefits: [
                'Real-time video processing',
                'Large-scale image datasets',
                'Pre-trained model libraries',
                'TensorRT inference optimization'
              ]
            },
            order: 1
          },
          {
            title: 'Natural Language Processing',
            description: 'Build and deploy large language models and NLP applications',
            icon: 'DocumentTextIcon',
            content: {
              benefits: [
                'Support for BERT, GPT models',
                'Fast tokenization & embedding',
                'Efficient fine-tuning',
                'Low-latency inference APIs'
              ]
            },
            order: 2
          }
        ];

        for (const useCase of useCases) {
          await connection.execute(
            `INSERT INTO product_section_items (section_id, item_type, title, description, icon, content, order_index, is_visible, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [sectionId, 'use_case', useCase.title, useCase.description, useCase.icon, JSON.stringify(useCase.content), useCase.order, 1]
          );
        }
      }

      if (section.section_type === 'cta') {
        await connection.execute(
          `INSERT INTO product_section_items (section_id, item_type, title, order_index, is_visible, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [sectionId, 'cta_primary', 'Start Free Trial', 0, 1]
        );
        
        await connection.execute(
          `INSERT INTO product_section_items (section_id, item_type, title, order_index, is_visible, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [sectionId, 'cta_secondary', 'Contact Sales Team', 1, 1]
        );
      }
    }

    console.log('\n✅ GPU Compute product created successfully!');
    console.log(`View at: http://149.13.60.6/products/gpu-compute`);
    console.log(`Edit in admin: http://149.13.60.6/admin/products`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

createGPUComputeProduct();
