import 'package:flutter/material.dart';
import 'package:sorteio_front/core/features/bolao/model/bolao_dto.dart';
import 'package:sorteio_front/core/features/bolao/controller/usuario/associar_usuario_controller.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class AssociarUsuarioPage extends StatefulWidget {
  final BolaoDto? bolao;

  const AssociarUsuarioPage({Key? key, this.bolao}) : super(key: key);

  @override
  State<AssociarUsuarioPage> createState() => _AssociarUsuarioPageState();
}

class _AssociarUsuarioPageState extends State<AssociarUsuarioPage> {
  final AssociarUsuarioController _controller = AssociarUsuarioController();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller.init(widget.bolao);
    _searchController.addListener(_onSearch);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearch);
    _searchController.dispose();
    _controller.dispose();
    super.dispose();
  }

  void _onSearch() => _controller.search(_searchController.text);

  Future<void> _save() async {
    // Usa o controller para associar e trata o resultado
    try {
      final ok = await _controller.associate();
      if (ok) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Usuário associado com sucesso')),
        );
        Navigator.of(context).pop(true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Falha ao associar usuário')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Erro: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.bolao?.nome ?? 'Associar usuário';
    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Container(
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Constants.lightGray),
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
                          border: InputBorder.none,
                          hintText: 'Buscar usuário...',
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
                    if (_controller.isLoading) {
                      return const Center(child: CircularProgressIndicator());
                    }
                    if (_controller.filtered.isEmpty) {
                      return Center(
                        child: Text(
                          'Nenhum usuário encontrado',
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                      );
                    }
                    return ListView.separated(
                      itemCount: _controller.filtered.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final u = _controller.filtered[index];
                        final selected = _controller.selected?.id == u.id;
                        return ListTile(
                          leading: CircleAvatar(
                            child: Text(
                              u.nome.isNotEmpty ? u.nome[0].toUpperCase() : '?',
                            ),
                          ),
                          title: Text(u.nome),
                          subtitle: u.telefone != null
                              ? Text(u.telefone!)
                              : null,
                          trailing: selected
                              ? const Icon(
                                  Icons.check,
                                  color: Constants.primary,
                                )
                              : null,
                          onTap: () => _controller.select(u),
                        );
                      },
                    );
                  },
                ),
              ),
              const SizedBox(height: 8),
              AnimatedBuilder(
                animation: _controller,
                builder: (context, _) {
                  return SwitchListTile(
                    activeColor: Constants.primary,
                    activeTrackColor: Constants.primary.withOpacity(0.5),
                    inactiveThumbColor: Constants.primary.withOpacity(0.5),
                    inactiveTrackColor: Constants.lightGray,
                    title: const Text('Criar como apto'),
                    value: _controller.apto,
                    onChanged: (v) => _controller.toggleApto(v),
                  );
                },
              ),
              const SizedBox(height: 8),
              // Bottom buttons: ensure they're above system navigation / keyboard
              Padding(
                padding: EdgeInsets.only(
                  bottom: MediaQuery.of(context).viewInsets.bottom + 8.0,
                ),
                child: SafeArea(
                  top: false,
                  child: Row(
                    children: [
                      Expanded(
                        child: AnimatedBuilder(
                          animation: _controller,
                          builder: (context, _) {
                            return ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    Constants.lightGray, 
                                foregroundColor:
                                    Constants.primary, 
                                padding: const EdgeInsets.symmetric(
                                  vertical: 14,
                                ),
                                elevation: 4,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              onPressed:  () => Navigator.of(context).pop(false),
                              child: const Text('Cancelar'),
                            );
                          },
                        ),
                      ),

                      const SizedBox(width: 12),
                      Expanded(
                        child: AnimatedBuilder(
                          animation: _controller,
                          builder: (context, _) {
                            return ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    Constants.primary, 
                                foregroundColor:
                                    Colors.white, 
                                padding: const EdgeInsets.symmetric(
                                  vertical: 14,
                                ),
                                elevation: 4,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              onPressed: _controller.isLoading ? null : _save,
                              child: const Text('Salvar'),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
