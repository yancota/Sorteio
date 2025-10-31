import 'package:flutter/material.dart';
import 'package:sorteio_front/core/features/bolao/controller/bolao_controller.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/utils/constants.dart';
import 'package:flutter_modular/flutter_modular.dart';

class BolaoDetailPage extends StatelessWidget {
  final BolaoDto bolao;

  const BolaoDetailPage({Key? key, required this.bolao}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final controller = BolaoController();
    final prize = controller.formatCurrency(bolao.valor);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          bolao.nome,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 4),
                const Text(
                  'Prêmio total',
                  style: TextStyle(fontSize: 16, color: Colors.grey),
                ),
                const SizedBox(height: 8),
                Text(
                  prize,
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    color: Constants.primary,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Gerencie o bolão e acompanhe os sorteios realizados.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Colors.grey.shade700),
                ),

                const SizedBox(height: 24),

                // Card: Usuários Inscritos
                _buildFeatureCard(
                  context,
                  icon: Icons.group,
                  title: 'Usuários Inscritos',
                  subtitle: 'Veja quem está participando',
                  onTap: () {
                    // Navega via Modular passando o bolão como argumento
                    Modular.to.pushNamed('/bolao/participantes', arguments: bolao);
                  },
                ),

                const SizedBox(height: 16),

                // Card: Sorteios
                _buildFeatureCard(
                  context,
                  icon: Icons.emoji_events,
                  title: 'Sorteios',
                  subtitle: 'Acompanhe os resultados',
                  onTap: () {
                    // TODO: navegar para tela de sorteios
                  },
                ),

                const SizedBox(height: 36),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12),
          child: SizedBox(
            height: 56,
            child: ElevatedButton(
              onPressed: () {
                // TODO: ação de participar do bolão
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Constants.primary,
                foregroundColor: Colors.black,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Participar do Bolão',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 20),
          child: Row(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: Constants.primary.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: Constants.primary, size: 28),
              ),
              const SizedBox(width: 18),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      subtitle,
                      style: TextStyle(color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
