import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/pages/participante_detail_page.dart';
import 'package:sorteio_front/core/features/bolao/pages/associar_usuario_page.dart';
import 'package:sorteio_front/core/features/bolao/controller/ranking_bolao_controller.dart';
import 'package:sorteio_front/core/utils/constants.dart';

// View model for the UI (mapped from ParticipanteDto)
class BolaoParticipantsPage extends StatefulWidget {
  final BolaoDto? bolao;

  const BolaoParticipantsPage({Key? key, this.bolao}) : super(key: key);

  @override
  State<BolaoParticipantsPage> createState() => _BolaoParticipantsPageState();
}

class _BolaoParticipantsPageState extends State<BolaoParticipantsPage> {
  final TextEditingController _searchController = TextEditingController();
  late final RankingBolaoController _controller;

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

    _controller = RankingBolaoController();
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

                  final list = _controller.participants;
                  if (list.isEmpty) {
                    return Center(
                      child: Text(
                        'Nenhum participante encontrado',
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
                        final p = list[index];
                        return InkWell(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => ParticipanteDetailPage(
                                  id: p.posicao,
                                  nome: p.nome,
                                  valoresEscolhidos: p.valoresEscolhidos,
                                  valoresAcertados: p.valoresAcertados,
                                ),
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
                                    _initials(p.nome),
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
                                        p.nome,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Pontuação: ${p.score}',
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
                                    Icon(
                                      p.apto
                                          ? Icons.check_circle
                                          : Icons.cancel,
                                      color: p.apto ? Colors.green : Colors.red,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      p.apto ? 'Apto' : 'Inapto',
                                      style: TextStyle(
                                        color: p.apto
                                            ? Colors.green
                                            : Colors.red,
                                        fontSize: 12,
                                      ),
                                    ),
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
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          // Abre a tela para associar usuário e, se retornar true, atualiza a lista
          final result = await Navigator.of(context).push<bool?>(
            MaterialPageRoute(
              builder: (_) => AssociarUsuarioPage(bolao: bolao),
            ),
          );
          if (result == true) {
            // Recarrega participantes
            _controller.refresh();
          }
        },
        backgroundColor: Constants.primary,
        foregroundColor: Colors.white,
        child: const Icon(Icons.person_add),
      ),
    );
  }

  String _initials(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return '';
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
}
