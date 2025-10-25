const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Sorteio',
      version: '1.0.0',
      description: 'API completa para gerenciamento de bolões e sorteios',
      contact: {
        name: 'Suporte',
        email: 'suporte@sorteio.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    tags: [
      {
        name: 'Usuários',
        description: 'Gerenciamento de usuários'
      },
      {
        name: 'Grupos',
        description: 'Gerenciamento de grupos'
      },
      {
        name: 'Sorteios',
        description: 'Gerenciamento de sorteios'
      },
      {
        name: 'Bolões',
        description: 'Gerenciamento de bolões'
      },
      {
        name: 'Inscrições',
        description: 'Gerenciamento de inscrições em bolões'
      },
      {
        name: 'Apostas',
        description: 'Gerenciamento de apostas'
      }
    ],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome do usuário'
            },
            telefone: {
              type: 'string',
              description: 'Telefone do usuário'
            },
            grupo: {
              $ref: '#/components/schemas/Grupo'
            }
          }
        },
        Grupo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do grupo'
            },
            nome: {
              type: 'string',
              description: 'Nome do grupo'
            },
            usuarioResponsavel: {
              $ref: '#/components/schemas/Usuario'
            }
          }
        },
        Sorteio: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do sorteio'
            },
            nome: {
              type: 'string',
              description: 'Nome do sorteio'
            },
            valor: {
              type: 'number',
              format: 'double',
              description: 'Valor do sorteio'
            },
            valoresSorteados: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Valores sorteados'
            }
          }
        },
        Bolao: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID do bolão'
            },
            nome: {
              type: 'string',
              description: 'Nome do bolão'
            },
            quantidadeCampeao: {
              type: 'integer',
              description: 'Quantidade de campeões'
            },
            reiniciarBolao: {
              type: 'boolean',
              description: 'Indica se o bolão deve ser reiniciado'
            },
            sorteios: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Sorteio'
              }
            }
          }
        },
        InscricaoBolao: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID da inscrição'
            },
            bolao: {
              $ref: '#/components/schemas/Bolao'
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            },
            apto: {
              type: 'boolean',
              description: 'Indica se a inscrição está apta'
            },
            pontuacaoTotal: {
              type: 'integer',
              description: 'Pontuação total do usuário'
            }
          }
        },
        Aposta: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID da aposta'
            },
            inscricaoBolao: {
              $ref: '#/components/schemas/InscricaoBolao'
            },
            sorteio: {
              $ref: '#/components/schemas/Sorteio'
            },
            valoresEscolhidos: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Valores escolhidos pelo usuário'
            },
            valoresAcertados: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Valores que o usuário acertou'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            },
            data: {
              type: 'object'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Descrição do erro'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
