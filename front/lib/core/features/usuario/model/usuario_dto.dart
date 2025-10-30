class UsuarioDto {
  final int id;
  final String nome;
  final String? telefone;
  final int? grupoId;
  final DateTime createdAt;
  final DateTime updatedAt;

  UsuarioDto({
    required this.id,
    required this.nome,
    this.telefone,
    this.grupoId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory UsuarioDto.fromJson(Map<String, dynamic> json) {
    return UsuarioDto(
      id: json['id'] is int
          ? json['id'] as int
          : int.tryParse(json['id']?.toString() ?? '') ?? 0,
      nome: json['nome'] as String? ?? '',
      telefone: json['telefone'] != null ? json['telefone'].toString() : null,
      grupoId: json['grupo_id'] is int
          ? json['grupo_id'] as int
          : (json['grupo_id'] == null
                ? null
                : int.tryParse(json['grupo_id'].toString())),
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'].toString())
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'].toString())
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'telefone': telefone,
      'grupo_id': grupoId,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
