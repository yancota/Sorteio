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
      id: json['id'] as int? ?? 0,
      nome: json['nome'] as String? ?? '',
      valor: json['valor'] as String? ?? '0.00',
      quantidadeCampeao: json['quantidade_campeao'] as int? ?? 0,
      reiniciarBolao: json['reiniciar_bolao'] as bool? ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : DateTime.now(),
      sorteios:
          (json['sorteios'] as List<dynamic>?)
              ?.map((e) => SorteioDto.fromJson(e as Map<String, dynamic>))
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
      id: json['id'] as int? ?? 0,
      nome: json['nome'] as String? ?? '',
      bolaoId: json['bolao_id'] as int? ?? 0,
      valoresSorteados:
          (json['valores_sorteados'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : DateTime.now(),
    );
  }
}
