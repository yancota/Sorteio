import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class ParticipanteDetailPage extends StatelessWidget {
  final int? id;
  final String nome;
  final List<String> valoresEscolhidos;
  final List<String> valoresAcertados;
  final int inscricaoId;

  const ParticipanteDetailPage({
    Key? key,
    this.id,
    required this.nome,
    required this.valoresEscolhidos,
    required this.valoresAcertados,
    required this.inscricaoId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(nome, style: const TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 12),
            Text(
              'Números escolhidos',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),

            // Grid de números escolhidos
            if (valoresEscolhidos.isNotEmpty)
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 12,
                runSpacing: 12,
                children: valoresEscolhidos.map((v) {
                  final acertou = valoresAcertados.contains(v);
                  return _numberChip(v, acertou, context);
                }).toList(),
              )
            else
              Center(
                heightFactor: 3,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 8),
                    const Icon(
                      Icons.info_outline,
                      size: 48,
                      color: Colors.grey,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Este participante ainda não escolheu números.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        if (id != null) {
                          Modular.to.pushNamed(
                            '/bolao/fazer_aposta',
                            arguments: {
                              'inscricaoId': inscricaoId,
                              'valoresEscolhidos': valoresEscolhidos,
                            },
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Constants.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          vertical: 12,
                          horizontal: 16,
                        ),
                      ),
                      child: const Text('Fazer aposta'),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 20),

            // Destaque dos números acertados (se houver)
            if (valoresAcertados.isNotEmpty) ...[
              Text(
                'Números acertados',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 10,
                runSpacing: 10,
                children: valoresAcertados
                    .map((v) => _numberChip(v, true, context))
                    .toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _numberChip(String text, bool highlighted, BuildContext context) {
    final color = highlighted ? Constants.primary : Constants.lightGray;
    final textColor = highlighted ? Colors.white : Constants.primary;
    return Container(
      width: 100,
      height: 100,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        boxShadow: highlighted
            ? [
                BoxShadow(
                  color: color.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: textColor,
        ),
      ),
    );
  }
}
