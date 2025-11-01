import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/controller/sorteio/buscar_sorteios_controller.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:intl/intl.dart';
import 'package:sorteio_front/core/features/bolao/model/criar_sorteio_dto.dart';
import 'package:sorteio_front/core/utils/constants.dart';
import 'package:sorteio_front/core/features/bolao/pages/sorteio/criar_sorteio_page.dart';

// View model for the UI (mapped from ParticipanteDto)
class BolaoSorteiosPage extends StatefulWidget {
  final BolaoDto? bolao;

  const BolaoSorteiosPage({Key? key, this.bolao}) : super(key: key);

  @override
  State<BolaoSorteiosPage> createState() => _BolaoParticipantsPageState();
}

class _BolaoParticipantsPageState extends State<BolaoSorteiosPage> {
  final TextEditingController _searchController = TextEditingController();
  late final BuscarSorteiosController _controller;

  late BolaoDto? bolao;

  @override
  void initState() {
    super.initState();
    // Tenta obter o bolão pelos args do Modular se não foi passado pelo construtor
    final raw = widget.bolao ?? Modular.args.data;
    if (raw is BolaoDto) {
      bolao = raw;
    } else if (raw is Map) {
      try {
        bolao = BolaoDto.fromJson(Map<String, dynamic>.from(raw));
      } catch (_) {
        bolao = null;
      }
    } else {
      bolao = null;
    }

    _controller = BuscarSorteiosController();
    // Registrar listener com referência para permitir remoção correta
    _searchController.addListener(_onSearch);
    _controller.init(bolao);
  }

  void _onSearch() {
    _controller.search(_searchController.text);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearch);
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final title = bolao?.nome ?? 'Participantes';
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Modular.to.pop(),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12),
        child: Column(
          children: [
            // Search bar - transparent
            Container(
              height: 52,
              decoration: BoxDecoration(
                color: Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Theme.of(context).dividerColor.withOpacity(0.3),
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                children: [
                  const Icon(Icons.search, color: Colors.grey),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      decoration: const InputDecoration(
                        hintText: 'Procure por algum participante',
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            Expanded(
              child: AnimatedBuilder(
                animation: _controller,
                builder: (context, _) {
                  if (_controller.isLoading)
                    return const Center(child: CircularProgressIndicator());

                  final list = _controller.sorteios;
                  if (list.isEmpty) {
                    return Center(
                      child: Text(
                        'Nenhum sorteio encontrado',
                        style: TextStyle(color: Colors.grey.shade600),
                      ),
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: _controller.refresh,
                    child: ListView.separated(
                      padding: const EdgeInsets.only(bottom: 84, top: 4),
                      itemCount: list.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final CriarSorteioDto s = list[index];
                        final date = DateTime.tryParse(
                          s.createdAt.toIso8601String(),
                        );
                        final formatted = date != null
                            ? DateFormat.yMMMd().format(date)
                            : '';
                        return InkWell(
                          onTap: () {
                            // mostra detalhes simples do sorteio
                            showDialog(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: Text(s.nome),
                                content: SingleChildScrollView(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      if (s.valoresSorteados.isNotEmpty) ...[
                                        const Text('Valores sorteados:'),
                                        const SizedBox(height: 8),
                                        Wrap(
                                          spacing: 8,
                                          runSpacing: 8,
                                          children: s.valoresSorteados
                                              .map((v) => Chip(label: Text(v)))
                                              .toList(),
                                        ),
                                      ] else
                                        const Text(
                                          'Nenhum valor sorteado registrado.',
                                        ),
                                      const SizedBox(height: 12),
                                      Text('Criado em: $formatted'),
                                    ],
                                  ),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () =>
                                        Navigator.of(context).pop(),
                                    child: const Text('Fechar'),
                                  ),
                                ],
                              ),
                            );
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey.shade300),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 20,
                                  backgroundColor: Constants.primary
                                      .withOpacity(0.12),
                                  child: Text(
                                    s.nome.isNotEmpty
                                        ? s.nome[0].toUpperCase()
                                        : '?',
                                    style: TextStyle(
                                      color: Constants.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        s.nome,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        formatted,
                                        style: TextStyle(
                                          color: Colors.grey.shade600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Column(
                                  children: [
                                    Text(
                                      '${s.valoresSorteados.length} valores',
                                    ),
                                    const SizedBox(height: 4),
                                    const Icon(Icons.calendar_today, size: 16),
                                  ],
                                ),
                              ],
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
      floatingActionButton: (bolao != null && (bolao!.id != 0))
          ? FloatingActionButton(
              onPressed: () async {
                final result = await Navigator.of(context).push<bool?>(
                  MaterialPageRoute(
                    builder: (_) => CriarSorteioPage(bolaoId: bolao!.id),
                  ),
                );
                if (result == true) {
                  _controller.refresh();
                }
              },
              backgroundColor: Constants.primary,
              foregroundColor: Colors.white,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  // helper removed: não usado para sorteios
}
