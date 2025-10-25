import 'package:flutter/material.dart';
import 'package:sorteio_front/core/features/bolao/controller/bolao_controller.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';

class BolaoPage extends StatefulWidget {
  const BolaoPage({Key? key}) : super(key: key);

  @override
  State<BolaoPage> createState() => _BolaoPageState();
}

class _BolaoPageState extends State<BolaoPage> {
  final BolaoController _controller = BolaoController();
  late Future<List<BolaoDto>> _futureBoloes;

  @override
  void initState() {
    super.initState();
    _futureBoloes = _controller.buscarBoloes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bolões')),
      body: FutureBuilder<List<BolaoDto>>(
        future: _futureBoloes,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Erro: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('Nenhum bolão encontrado.'));
          }
          final boloes = snapshot.data!;
          return ListView.builder(
            itemCount: boloes.length,
            itemBuilder: (context, index) {
              final bolao = boloes[index];
              return Card(
                margin: const EdgeInsets.all(8.0),
                elevation: 4.0,
                child: ExpansionTile(
                  title: Text(
                    bolao.nome,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  subtitle: Text(
                    'Valor: ${_controller.formatCurrency(bolao.valor)} | Campeões: ${bolao.quantidadeCampeao}',
                    style: const TextStyle(color: Colors.grey),
                  ),
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'ID: ${bolao.id}',
                            style: const TextStyle(fontSize: 14),
                          ),
                          Text(
                            'Reiniciar Bolão: ${_controller.formatBoolean(bolao.reiniciarBolao)}',
                            style: const TextStyle(fontSize: 14),
                          ),
                          Text(
                            'Criado em: ${_controller.formatDate(bolao.createdAt)}',
                            style: const TextStyle(fontSize: 14),
                          ),
                          Text(
                            'Atualizado em: ${_controller.formatDate(bolao.updatedAt)}',
                            style: const TextStyle(fontSize: 14),
                          ),
                          const SizedBox(height: 10),
                          if (bolao.sorteios.isNotEmpty) ...[
                            const Text(
                              'Sorteios:',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 5),
                            ...bolao.sorteios.map(
                              (sorteio) => Card(
                                color: Colors.blue.shade50,
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Nome: ${sorteio.nome}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        'ID: ${sorteio.id} | Bolão ID: ${sorteio.bolaoId}',
                                      ),
                                      Text(
                                        'Valores Sorteados: ${sorteio.valoresSorteados.join(', ')}',
                                        style: const TextStyle(
                                          color: Colors.red,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        'Criado em: ${_controller.formatDate(sorteio.createdAt)}',
                                      ),
                                      Text(
                                        'Atualizado em: ${_controller.formatDate(sorteio.updatedAt)}',
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ] else ...[
                            const Text('Nenhum sorteio associado.'),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
