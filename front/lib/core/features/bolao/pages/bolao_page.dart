import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/controller/bolao_controller.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class BolaoPage extends StatefulWidget {
  const BolaoPage({Key? key}) : super(key: key);

  @override
  State<BolaoPage> createState() => _BolaoPageState();
}

class _BolaoPageState extends State<BolaoPage> {
  final BolaoController _controller = BolaoController();
  late Future<List<BolaoDto>> _futureBoloes;
  final TextEditingController _searchController = TextEditingController();
  String _filter = '';

  @override
  void initState() {
    super.initState();
    _futureBoloes = _controller.buscarBoloes();
    _searchController.addListener(() {
      setState(() => _filter = _searchController.text.trim());
    });
  }

  Future<void> _refresh() async {
    setState(() => _futureBoloes = _controller.buscarBoloes());
    await _futureBoloes;
  }

  // status color helper removed because status is not currently displayed separately.

  @override
  Widget build(BuildContext context) {
    final primary = Constants.primary;

    return Scaffold(
      appBar: AppBar(title: const Text('Encontre um Bolão'), elevation: 0),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final result = await Modular.to.pushNamed('/bolao/criar');
          if (result == true) {
            _refresh();
          }
        },
        backgroundColor: primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Criar Bolão'),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          children: [
            const SizedBox(height: 8),
            // Search bar
            SizedBox(
              height: 56,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: Theme.of(
                            context,
                          ).dividerColor.withOpacity(0.6),
                          width: 1,
                        ),
                      ),
                      child: TextField(
                        controller: _searchController,
                        textAlignVertical: TextAlignVertical.center,
                        decoration: InputDecoration(
                          prefixIcon: const Icon(
                            Icons.search,
                            color: Colors.grey,
                          ),
                          hintText: 'Buscar pelo nome do bolão...',
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            Expanded(
              child: FutureBuilder<List<BolaoDto>>(
                future: _futureBoloes,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Erro: ${snapshot.error}'));
                  }

                  final data = snapshot.data ?? [];
                  final filtered = _filter.isEmpty
                      ? data
                      : data
                            .where(
                              (b) => b.nome.toLowerCase().contains(
                                _filter.toLowerCase(),
                              ),
                            )
                            .toList();

                  if (filtered.isEmpty) {
                    // Empty state with dashed border
                    return RefreshIndicator(
                      onRefresh: _refresh,
                      child: ListView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        children: [
                          const SizedBox(height: 40),
                          Container(
                            margin: const EdgeInsets.symmetric(vertical: 16),
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              children: [
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(18),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: Colors.grey.shade300,
                                      width: 2,
                                      style: BorderStyle.solid,
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.sports_soccer,
                                        size: 48,
                                        color: Colors.grey.shade400,
                                      ),
                                      const SizedBox(height: 12),
                                      Text(
                                        'Nenhum bolão encontrado',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey.shade800,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        'Que tal criar um novo bolão e chamar os amigos?',
                                        style: TextStyle(
                                          color: Colors.grey.shade600,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: _refresh,
                    child: ListView.separated(
                      itemCount: filtered.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      padding: const EdgeInsets.only(bottom: 24, top: 4),
                      itemBuilder: (context, index) {
                        final bolao = filtered[index];

                        return Material(
                          color: Colors.transparent,
                          borderRadius: BorderRadius.circular(12),

                          child: InkWell(
                            borderRadius: BorderRadius.circular(12),
                            onTap: () {
                              Modular.to.pushNamed(
                                '/bolao/detail',
                                arguments: bolao,
                              );
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: Theme.of(context).cardColor,
                                borderRadius: BorderRadius.circular(12),

                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 4,
                                    offset: const Offset(0, 1),
                                  ),
                                ],
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 16,
                              ),
                              margin: const EdgeInsets.symmetric(horizontal: 0),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const SizedBox(height: 6),
                                        Text(
                                          bolao.nome,
                                          style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          _controller.formatCurrency(
                                            bolao.valor,
                                          ),
                                          style: TextStyle(
                                            color: Colors.grey.shade600,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Icon(
                                    Icons.chevron_right,
                                    color: Colors.grey.shade400,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
