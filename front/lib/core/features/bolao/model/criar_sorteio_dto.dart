// DTO para resposta de criação de sorteio
class CriarSorteioResponseDto {
  final bool success;
  final String? message;
  final CriarSorteioDto? data;

  CriarSorteioResponseDto({required this.success, this.message, this.data});

  factory CriarSorteioResponseDto.fromJson(Map<String, dynamic> json) {
    return CriarSorteioResponseDto(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String?,
      data: json['data'] != null
          ? CriarSorteioDto.fromJson(Map<String, dynamic>.from(json['data']))
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'success': success,
    'message': message,
    'data': data?.toJson(),
  };
}

class CriarSorteioDto {
  final int id;
  final int bolaoId;
  final String nome;
  final List<String> valoresSorteados;
  final DateTime createdAt;
  final DateTime updatedAt;

  CriarSorteioDto({
    required this.id,
    required this.bolaoId,
    required this.nome,
    required this.valoresSorteados,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CriarSorteioDto.fromJson(Map<String, dynamic> json) {
    return CriarSorteioDto(
      id: json['id'] as int? ?? 0,
      bolaoId: json['bolao_id'] as int? ?? 0,
      nome: json['nome'] as String? ?? '',
      valoresSorteados:
          (json['valores_sorteados'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'bolao_id': bolaoId,
    'nome': nome,
    'valores_sorteados': valoresSorteados,
    'created_at': createdAt.toIso8601String(),
    'updated_at': updatedAt.toIso8601String(),
  };
}
