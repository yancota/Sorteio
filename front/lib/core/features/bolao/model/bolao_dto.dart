class BolaoDto {
  final int id;
  final String nome;
  final String valor;
  final int quantidadeCampeao;
  final bool reiniciarBolao;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<SorteioDto> sorteios;

  BolaoDto({
    required this.id,
    required this.nome,
    required this.valor,
    required this.quantidadeCampeao,
    required this.reiniciarBolao,
    required this.createdAt,
    required this.updatedAt,
    required this.sorteios,
  });

  factory BolaoDto.fromJson(Map<String, dynamic> json) {
    return BolaoDto(
      id: json['id'],
      nome: json['nome'],
      valor: json['valor'],
      quantidadeCampeao: json['quantidade_campeao'],
      reiniciarBolao: json['reiniciar_bolao'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      sorteios:
          (json['sorteios'] as List<dynamic>?)
              ?.map((e) => SorteioDto.fromJson(e))
              .toList() ??
          [],
    );
  }
}

class SorteioDto {
  final int id;
  final String nome;
  final int bolaoId;
  final List<String> valoresSorteados;
  final DateTime createdAt;
  final DateTime updatedAt;

  SorteioDto({
    required this.id,
    required this.nome,
    required this.bolaoId,
    required this.valoresSorteados,
    required this.createdAt,
    required this.updatedAt,
  });

  factory SorteioDto.fromJson(Map<String, dynamic> json) {
    return SorteioDto(
      id: json['id'],
      nome: json['nome'],
      bolaoId: json['bolao_id'],
      valoresSorteados:
          (json['valores_sorteados'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}
