const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cms.db');

console.log('📝 Adding comprehensive content to products...\n');

// Comprehensive content for Cloud Compute Instances
const cloudComputeContent = {
  features: [
    {
      title: 'NVIDIA GPU Fleet',
      description: 'Access to the latest NVIDIA A100, H100, and RTX GPUs with high-performance compute capabilities for AI/ML workloads and deep learning training.',
      icon: 'CpuChipIcon'
    },
    {
      title: 'Auto-Scaling',
      description: 'Automatically scale your compute resources up or down based on workload demands, optimizing costs while ensuring performance when you need it.',
      icon: 'ArrowPathIcon'
    },
    {
      title: 'Pre-installed Frameworks',
      description: 'Pre-configured environments with TensorFlow, PyTorch, CUDA toolkit, and cuDNN ready to use out of the box for immediate productivity.',
      icon: 'CircleStackIcon'
    },
    {
      title: 'Jupyter Notebooks',
      description: 'Integrated Jupyter notebook environment with GPU support for interactive data science, model development, and experimentation.',
      icon: 'DocumentTextIcon'
    },
    {
      title: 'Model Registry',
      description: 'Centralized model versioning and registry system for managing, tracking, and deploying your machine learning models efficiently.',
      icon: 'CubeIcon'
    },
    {
      title: 'Distributed Training',
      description: 'Seamless multi-GPU and multi-node distributed training capabilities for scaling your deep learning workloads across clusters.',
      icon: 'ServerIcon'
    }
  ],
  hero: {
    features: [
      'Scalable virtual machines from 1 vCPU to 64 vCPUs with high-performance Intel Xeon processors',
      'NVMe SSD storage with up to 10TB capacity and 100,000 IOPS for lightning-fast data access',
      '99.9% uptime SLA with automated backups and disaster recovery included'
    ],
    stats: [
      { value: '1-64', label: 'vCPUs Available' },
      { value: '99.9%', label: 'Uptime SLA' },
      { value: '24/7', label: 'Support' }
    ],
    cta: {
      primary: { title: 'Launch Console', description: 'Start Deploying', value: 'Deploy in 60 seconds' },
      secondary: { title: 'Contact Sales', description: 'Talk to Expert', value: 'Get custom quote' }
    }
  },
  specifications: [
    {
      title: 'Compute Resources',
      description: 'Flexible compute options for every workload',
      features: [
        '1 to 64 vCPUs available with Intel Xeon processors',
        'Burstable and dedicated CPU options for different workload types',
        'High-frequency cores optimized for single-threaded performance',
        'CPU credits system for cost-effective burstable instances'
      ],
      icon: 'CpuChipIcon'
    },
    {
      title: 'Memory & Storage',
      description: 'High-performance storage solutions',
      features: [
        '1GB to 256GB RAM options for memory-intensive applications',
        'NVMe SSD storage up to 10TB with high IOPS performance',
        'Snapshot and automated backup capabilities',
        'Attach multiple storage volumes per instance'
      ],
      icon: 'CircleStackIcon'
    },
    {
      title: 'Network & Connectivity',
      description: 'High-speed network connectivity',
      features: [
        '1Gbps to 10Gbps network speed options',
        'Unlimited bandwidth on all plans',
        'DDoS protection included at no extra cost',
        'Private networking and VPC support for secure isolation'
      ],
      icon: 'GlobeAltIcon'
    },
    {
      title: 'Operating Systems',
      description: 'Choose from multiple operating systems',
      features: [
        'Ubuntu 20.04 LTS and 22.04 LTS',
        'CentOS 7, 8, and Rocky Linux 8',
        'Windows Server 2019 and 2022',
        'Custom OS images supported'
      ],
      icon: 'ServerIcon'
    },
    {
      title: 'Security Features',
      description: 'Enterprise-grade security built-in',
      features: [
        'Firewall and security groups for network access control',
        'SSH key pair authentication for secure access',
        'Encrypted storage volumes with AES-256 encryption',
        'VPC isolation for network-level security'
      ],
      icon: 'ShieldCheckIcon'
    },
    {
      title: 'Management & Monitoring',
      description: 'Comprehensive management tools',
      features: [
        'Web-based console for easy instance management',
        'API access for automation and integration',
        'Real-time monitoring and alerting',
        'Auto-scaling and load balancing options'
      ],
      icon: 'ChartBarIcon'
    }
  ],
  security: [
    {
      title: 'Data Encryption',
      description: 'End-to-end encryption for data at rest and in transit using industry-standard AES-256 encryption protocols.',
      icon: 'LockClosedIcon'
    },
    {
      title: 'Firewall & Network Security',
      description: 'Advanced firewall protection with security groups and VPC for secure network isolation and traffic control.',
      icon: 'ShieldCheckIcon'
    },
    {
      title: 'Compliance Standards',
      description: 'Compliant with Indian data protection regulations, GDPR, and international security standards for enterprise deployments.',
      icon: 'DocumentCheckIcon'
    }
  ],
  support: [
    {
      title: '24/7 Technical Support',
      description: 'Round-the-clock technical support via phone, email, and live chat from our certified cloud engineers.',
      icon: 'PhoneIcon'
    },
    {
      title: '99.9% Uptime SLA',
      description: 'Guaranteed service availability with SLA-backed uptime commitment and financial credits for any downtime.',
      icon: 'ChartBarIcon'
    },
    {
      title: 'Expert Cloud Engineers',
      description: 'Direct access to certified cloud architects and DevOps specialists for infrastructure optimization.',
      icon: 'UsersIcon'
    },
    {
      title: 'Comprehensive Documentation',
      description: 'Extensive documentation, tutorials, and knowledge base to help you get the most out of your infrastructure.',
      icon: 'BookOpenIcon'
    }
  ],
  migration: [
    {
      title: 'Assessment & Planning',
      description: 'Our experts analyze your current infrastructure and create a detailed migration roadmap tailored to your needs.',
      icon: null
    },
    {
      title: 'Seamless Migration',
      description: 'Zero-downtime migration of your applications and data with automated tools and expert assistance.',
      icon: null
    },
    {
      title: 'Optimization & Support',
      description: 'Post-migration optimization and 24/7 support to ensure optimal performance and cost efficiency.',
      icon: null
    }
  ],
  useCases: [
    {
      title: 'Web Applications',
      description: 'E-commerce, corporate websites, APIs, and web services',
      content: {
        benefits: [
          'High availability hosting with auto-scaling',
          'SSL certificate support and CDN integration',
          'Load balancing for traffic distribution',
          'Database hosting and caching support'
        ]
      },
      icon: 'GlobeAltIcon'
    },
    {
      title: 'Development & Testing',
      description: 'Dev environments, staging servers, CI/CD pipelines',
      content: {
        benefits: [
          'Isolated development environments',
          'Quick deployment and rollback capabilities',
          'Git integration and container support',
          'Cost-effective dev/test environments'
        ]
      },
      icon: 'CpuChipIcon'
    },
    {
      title: 'Business Applications',
      description: 'ERP, CRM, and enterprise software hosting',
      content: {
        benefits: [
          'Dedicated resources for business-critical apps',
          'High-performance compute for database workloads',
          'Secure network isolation with VPC',
          'Automated backups and disaster recovery'
        ]
      },
      icon: 'BuildingOfficeIcon'
    },
    {
      title: 'Data Processing',
      description: 'Batch processing, analytics, and ETL workloads',
      content: {
        benefits: [
          'High-memory instances for large datasets',
          'Parallel processing capabilities',
          'Integration with data warehouses',
          'Scalable compute for big data analytics'
        ]
      },
      icon: 'CircleStackIcon'
    }
  ]
};

// Comprehensive content for Block Storage
const blockStorageContent = {
  features: [
    {
      title: 'High IOPS Performance',
      description: 'Up to 100,000 IOPS with low latency SSD storage optimized for demanding database and application workloads requiring fast data access.',
      icon: 'ChartBarIcon'
    },
    {
      title: 'Elastic Scaling',
      description: 'Dynamically resize your storage volumes from 10GB to 16TB without downtime, adapting to your growing data needs seamlessly.',
      icon: 'ArrowPathIcon'
    },
    {
      title: 'Data Durability',
      description: '99.99% durability with automatic replication across multiple availability zones ensuring your data is protected against failures.',
      icon: 'ShieldCheckIcon'
    },
    {
      title: 'Snapshot Support',
      description: 'Create instant point-in-time snapshots for backups and rapid recovery, enabling efficient data protection and version management.',
      icon: 'CameraIcon'
    },
    {
      title: 'Easy Attachment',
      description: 'Attach and detach storage volumes to any compute instance with simple API calls or web console, providing flexible storage management.',
      icon: 'LinkIcon'
    },
    {
      title: 'Encrypted Storage',
      description: 'All data encrypted at rest using AES-256 encryption with managed encryption keys for maximum security and compliance.',
      icon: 'LockClosedIcon'
    }
  ],
  hero: {
    features: [
      'High IOPS SSD storage with up to 100,000 IOPS for maximum performance',
      'Scale from 10GB to 16TB per volume without downtime or data migration',
      '99.99% durability with automatic replication across availability zones'
    ],
    stats: [
      { value: '100K', label: 'Max IOPS' },
      { value: '99.99%', label: 'Durability' },
      { value: '16TB', label: 'Max Volume' }
    ],
    cta: {
      primary: { title: 'Create Volume', description: 'Get Started', value: 'Deploy in seconds' },
      secondary: { title: 'Contact Sales', description: 'Enterprise Plans', value: 'Custom solutions' }
    }
  },
  specifications: [
    {
      title: 'Storage Performance',
      description: 'High-performance SSD storage',
      features: [
        'Up to 100,000 IOPS per volume with sub-millisecond latency',
        'SSD-backed storage for consistent high performance',
        'Optimized for database and transactional workloads',
        'Burst capability for temporary performance spikes'
      ],
      icon: 'CircleStackIcon'
    },
    {
      title: 'Storage Capacity',
      description: 'Flexible storage sizes for any need',
      features: [
        '10GB to 16TB per volume with incremental growth',
        'Multiple volumes per instance for organization',
        'Scale without downtime or performance impact',
        'Pay only for the storage you actually use'
      ],
      icon: 'ServerIcon'
    },
    {
      title: 'Data Protection',
      description: 'Enterprise-grade data protection',
      features: [
        '99.99% durability SLA with automatic replication',
        'Instant snapshot creation and restoration',
        'Cross-zone replication for disaster recovery',
        'AES-256 encryption at rest by default'
      ],
      icon: 'ShieldCheckIcon'
    },
    {
      title: 'Backup & Recovery',
      description: 'Comprehensive backup solutions',
      features: [
        'Automated daily backups with configurable retention',
        'Point-in-time recovery to any snapshot',
        'Clone volumes from snapshots instantly',
        'Export snapshots for off-site backup'
      ],
      icon: 'ArrowPathIcon'
    },
    {
      title: 'Performance Monitoring',
      description: 'Real-time performance insights',
      features: [
        'IOPS, throughput, and latency metrics',
        'Storage utilization and capacity alerts',
        'Performance optimization recommendations',
        'Historical performance analysis and reporting'
      ],
      icon: 'ChartBarIcon'
    },
    {
      title: 'Integration Options',
      description: 'Seamless cloud integration',
      features: [
        'Easy attachment to any compute instance',
        'API and CLI support for automation',
        'Integration with Kubernetes and containers',
        'Support for Windows and Linux file systems'
      ],
      icon: 'CogIcon'
    }
  ],
  security: [
    {
      title: 'Encryption at Rest',
      description: 'All data encrypted using AES-256 encryption with managed encryption keys stored securely in our key management system.',
      icon: 'LockClosedIcon'
    },
    {
      title: 'Access Control',
      description: 'Fine-grained access control with IAM policies and security groups for controlling who can access your storage volumes.',
      icon: 'ShieldCheckIcon'
    },
    {
      title: 'Compliance & Certifications',
      description: 'Compliant with GDPR, SOC 2, ISO 27001, and Indian data protection regulations for enterprise data requirements.',
      icon: 'DocumentCheckIcon'
    }
  ],
  support: [
    {
      title: '24/7 Storage Support',
      description: 'Round-the-clock support from storage specialists via phone, email, and live chat for any storage-related issues.',
      icon: 'PhoneIcon'
    },
    {
      title: '99.99% Durability SLA',
      description: 'Guaranteed data durability with automatic replication and financial credits for any data loss incidents.',
      icon: 'ShieldCheckIcon'
    },
    {
      title: 'Storage Architects',
      description: 'Direct access to storage engineers for performance optimization and capacity planning assistance.',
      icon: 'UsersIcon'
    },
    {
      title: 'Migration Assistance',
      description: 'Expert guidance for migrating existing data to block storage with zero-downtime migration strategies.',
      icon: 'ArrowPathIcon'
    }
  ],
  migration: [
    {
      title: 'Data Assessment',
      description: 'Evaluate your current storage needs and create a migration plan optimized for performance and cost.',
      icon: null
    },
    {
      title: 'Secure Data Transfer',
      description: 'High-speed secure data transfer with encryption in transit and progress tracking for large migrations.',
      icon: null
    },
    {
      title: 'Verification & Optimization',
      description: 'Post-migration verification and performance optimization to ensure optimal storage configuration.',
      icon: null
    }
  ],
  useCases: [
    {
      title: 'Database Storage',
      description: 'MySQL, PostgreSQL, MongoDB, and other databases',
      content: {
        benefits: [
          'High IOPS for database performance',
          'Low latency for transaction processing',
          'Snapshot backups for point-in-time recovery',
          'Scalable storage as databases grow'
        ]
      },
      icon: 'CircleStackIcon'
    },
    {
      title: 'Application Storage',
      description: 'Application data, file systems, and user content',
      content: {
        benefits: [
          'Consistent performance for applications',
          'Easy attachment and detachment',
          'Snapshot support for version control',
          'Scalable storage for growing applications'
        ]
      },
      icon: 'ServerIcon'
    },
    {
      title: 'Backup & Archive',
      description: 'Backup storage and long-term data archival',
      content: {
        benefits: [
          'Cost-effective storage for backups',
          'Instant snapshot creation',
          'Cross-zone replication for redundancy',
          'Long-term data retention options'
        ]
      },
      icon: 'ArrowPathIcon'
    },
    {
      title: 'Development & Testing',
      description: 'Dev/test environments and temporary storage',
      content: {
        benefits: [
          'Quick volume provisioning',
          'Snapshot-based environment cloning',
          'Cost-effective for temporary workloads',
          'Easy cleanup and volume deletion'
        ]
      },
      icon: 'CpuChipIcon'
    }
  ]
};

// Function to update product content
function updateProductContent(productRoute, content, callback) {
  db.get("SELECT id FROM products WHERE route = ?", [productRoute], (err, product) => {
    if (err || !product) {
      console.error(`❌ Product not found: ${productRoute}`);
      callback();
      return;
    }

    const productId = product.id;
    console.log(`\n📦 Updating: ${productId === 79 ? 'Cloud Compute Instances' : 'Block Storage'} (ID: ${productId})`);

    let updated = 0;
    let total = 0;

    // Count total updates
    total += content.features.length;
    total += content.hero.features.length + content.hero.stats.length + 2; // CTA items
    total += content.specifications.length;
    total += content.security.length;
    total += content.support.length;
    total += content.migration.length;
    total += content.useCases.length;

    // Update features section items
    db.all(`SELECT ps.id FROM product_sections ps WHERE ps.product_id = ? AND ps.section_type = 'features'`, [productId], (err, sections) => {
      if (!err && sections.length > 0) {
        const sectionId = sections[0].id;
        // Delete existing items
        db.run(`DELETE FROM product_items WHERE section_id = ?`, [sectionId], () => {
          content.features.forEach((feature, index) => {
            db.run(`
              INSERT INTO product_items (section_id, item_type, title, description, icon, order_index, is_visible, created_at, updated_at)
              VALUES (?, 'feature_card', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [sectionId, feature.title, feature.description, feature.icon, index], function(err) {
              if (!err) {
                updated++;
                if (updated === total) {
                  console.log(`   ✅ Updated all content`);
                  callback();
                }
              }
            });
          });
        });
      }
    });

    // Update hero section items
    db.all(`SELECT ps.id FROM product_sections ps WHERE ps.product_id = ? AND ps.section_type = 'hero'`, [productId], (err, sections) => {
      if (!err && sections.length > 0) {
        const sectionId = sections[0].id;
        db.run(`DELETE FROM product_items WHERE section_id = ?`, [sectionId], () => {
          let heroUpdated = 0;
          const heroTotal = content.hero.features.length + content.hero.stats.length + 2;
          
          // Add feature bullets
          content.hero.features.forEach((feature, index) => {
            db.run(`
              INSERT INTO product_items (section_id, item_type, title, order_index, is_visible, created_at, updated_at)
              VALUES (?, 'feature', ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [sectionId, feature, index], function(err) {
              heroUpdated++;
              if (heroUpdated === heroTotal) {
                updated += heroTotal;
                if (updated === total) callback();
              }
            });
          });
          
          // Add stats
          content.hero.stats.forEach((stat, index) => {
            db.run(`
              INSERT INTO product_items (section_id, item_type, title, value, label, order_index, is_visible, created_at, updated_at)
              VALUES (?, 'stat', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [sectionId, stat.value, stat.value, stat.label, content.hero.features.length + index], function(err) {
              heroUpdated++;
              if (heroUpdated === heroTotal) {
                updated += heroTotal;
                if (updated === total) callback();
              }
            });
          });
          
          // Add CTA buttons
          db.run(`
            INSERT INTO product_items (section_id, item_type, title, description, value, order_index, is_visible, created_at, updated_at)
            VALUES (?, 'cta_primary', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `, [sectionId, content.hero.cta.primary.title, content.hero.cta.primary.description, content.hero.cta.primary.value, content.hero.features.length + content.hero.stats.length], function(err) {
            heroUpdated++;
            if (heroUpdated === heroTotal) {
              updated += heroTotal;
              if (updated === total) callback();
            }
          });
          
          db.run(`
            INSERT INTO product_items (section_id, item_type, title, description, value, order_index, is_visible, created_at, updated_at)
            VALUES (?, 'cta_secondary', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `, [sectionId, content.hero.cta.secondary.title, content.hero.cta.secondary.description, content.hero.cta.secondary.value, content.hero.features.length + content.hero.stats.length + 1], function(err) {
            heroUpdated++;
            if (heroUpdated === heroTotal) {
              updated += heroTotal;
              if (updated === total) callback();
            }
          });
        });
      }
    });

    // Update specifications
    db.all(`SELECT ps.id FROM product_sections ps WHERE ps.product_id = ? AND ps.section_type = 'specifications'`, [productId], (err, sections) => {
      if (!err && sections.length > 0) {
        const sectionId = sections[0].id;
        db.run(`DELETE FROM product_items WHERE section_id = ?`, [sectionId], () => {
          content.specifications.forEach((spec, index) => {
            db.run(`
              INSERT INTO product_items (section_id, item_type, title, description, content, icon, order_index, is_visible, created_at, updated_at)
              VALUES (?, 'specification', ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [sectionId, spec.title, spec.description, JSON.stringify({ features: spec.features }), spec.icon, index], function(err) {
              updated++;
              if (updated === total) callback();
            });
          });
        });
      }
    });

    // Update security
    db.all(`SELECT ps.id FROM product_sections ps WHERE ps.product_id = ? AND ps.section_type = 'security'`, [productId], (err, sections) => {
      if (!err && sections.length > 0) {
        const sectionId = sections[0].id;
        db.run(`DELETE FROM product_items WHERE section_id = ?`, [sectionId], () => {
          content.security.forEach((item, index) => {
            db.run(`
              INSERT INTO product_items (section_id, item_type, title, description, icon, order_index, is_visible, created_at, updated_at)
              VALUES (?, 'security_feature', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [sectionId, item.title, item.description, item.icon, index], function(err) {
              updated++;
              if (updated === total) callback();
            });
          });
        });
      }
    });

    // Update support
    db.all(`SELECT ps.id FROM product_sections ps WHERE ps.product_id = ? AND ps.section_type = 'support'`, [productId], (err, sections) => {
      if (!err && sections.length > 0) {
        const sectionId = sections[0].id;
        db.run(`DELETE FROM product_items WHERE section_id = ?`, [sectionId], () => {
          content.support.forEach((item, index) => {
            db.run(`
              INSERT INTO product_items (section_id, item_type, title, description, icon, order_index, is_visible, created_at, updated_at)
              VALUES (?, 'support_feature', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [sectionId, item.title, item.description, item.icon, index], function(err) {
              updated++;
              if (updated === total) callback();
            });
          });
        });
      }
    });

    // Update migration
    db.all(`SELECT ps.id FROM product_sections ps WHERE ps.product_id = ? AND ps.section_type = 'migration'`, [productId], (err, sections) => {
      if (!err && sections.length > 0) {
        const sectionId = sections[0].id;
        db.run(`DELETE FROM product_items WHERE section_id = ?`, [sectionId], () => {
          content.migration.forEach((item, index) => {
            db.run(`
              INSERT INTO product_items (section_id, item_type, title, description, order_index, is_visible, created_at, updated_at)
              VALUES (?, 'migration_step', ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [sectionId, item.title, item.description, index], function(err) {
              updated++;
              if (updated === total) callback();
            });
          });
        });
      }
    });

    // Update use cases
    db.all(`SELECT ps.id FROM product_sections ps WHERE ps.product_id = ? AND ps.section_type = 'use_cases'`, [productId], (err, sections) => {
      if (!err && sections.length > 0) {
        const sectionId = sections[0].id;
        db.run(`DELETE FROM product_items WHERE section_id = ?`, [sectionId], () => {
          content.useCases.forEach((item, index) => {
            db.run(`
              INSERT INTO product_items (section_id, item_type, title, description, content, icon, order_index, is_visible, created_at, updated_at)
              VALUES (?, 'use_case', ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `, [sectionId, item.title, item.description, JSON.stringify(item.content), item.icon, index], function(err) {
              updated++;
              if (updated === total) callback();
            });
          });
        });
      }
    });
  });
}

let productsProcessed = 0;

// Update Cloud Compute Instances
updateProductContent('cloud-compute-instances', cloudComputeContent, () => {
  productsProcessed++;
  if (productsProcessed === 2) {
    console.log('\n✅ All product content updated with comprehensive descriptions!');
    db.close();
  }
});

// Update Block Storage
updateProductContent('block-storage', blockStorageContent, () => {
  productsProcessed++;
  if (productsProcessed === 2) {
    console.log('\n✅ All product content updated with comprehensive descriptions!');
    db.close();
  }
});

