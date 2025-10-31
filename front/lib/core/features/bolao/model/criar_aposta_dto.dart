// DTO para resposta de criação de aposta
class CriarApostaResponseDto {
  final bool success;
  final String? message;
  final CriarApostaDto? data;

  CriarApostaResponseDto({required this.success, this.message, this.data});

  factory CriarApostaResponseDto.fromJson(Map<String, dynamic> json) {
    return CriarApostaResponseDto(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String?,
      data: json['data'] != null
          ? CriarApostaDto.fromJson(Map<String, dynamic>.from(json['data']))
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'success': success,
    'message': message,
    'data': data?.toJson(),
  };
}

class CriarApostaDto {
  final int id;
  final int inscricaoBolaoId;
  final List<String> valoresEscolhidos;
  final List<String>? valoresAcertados;
  final int pontuacao;
  final DateTime createdAt;
  final DateTime updatedAt;

  CriarApostaDto({
    required this.id,
    required this.inscricaoBolaoId,
    required this.valoresEscolhidos,
    this.valoresAcertados,
    required this.pontuacao,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CriarApostaDto.fromJson(Map<String, dynamic> json) {
    return CriarApostaDto(
      id: json['id'] as int? ?? 0,
      inscricaoBolaoId: json['inscricao_bolao_id'] as int? ?? 0,
      valoresEscolhidos:
          (json['valores_escolhidos'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      valoresAcertados: (json['valores_acertados'] as List<dynamic>?)
          ?.map((e) => e.toString())
          .toList(),
      pontuacao: json['pontuacao'] as int? ?? 0,
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
    'inscricao_bolao_id': inscricaoBolaoId,
    'valores_escolhidos': valoresEscolhidos,
    'valores_acertados': valoresAcertados,
    'pontuacao': pontuacao,
    'created_at': createdAt.toIso8601String(),
    'updated_at': updatedAt.toIso8601String(),
  };
}
