// DTO simples para o endpoint de ranking do bolão
class RankingBolaoDto {
  final bool success;
  final RankingDataDto? data;

  RankingBolaoDto({required this.success, this.data});

  factory RankingBolaoDto.fromJson(Map<String, dynamic> json) {
    return RankingBolaoDto(
      success: json['success'] as bool? ?? false,
      data: json['data'] != null
          ? RankingDataDto.fromJson(json['data'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {'success': success, 'data': data?.toJson()};
}

class RankingDataDto {
  final String bolao;
  final List<ParticipanteDto> participantes;
  final List<SorteioResumoDto> sorteios;

  RankingDataDto({
    required this.bolao,
    required this.participantes,
    required this.sorteios,
  });

  factory RankingDataDto.fromJson(Map<String, dynamic> json) {
    return RankingDataDto(
      bolao: json['bolao'] as String? ?? '',
      participantes:
          (json['participantes'] as List<dynamic>?)
              ?.map((e) => ParticipanteDto.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      sorteios:
          (json['sorteios'] as List<dynamic>?)
              ?.map((e) => SorteioResumoDto.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() => {
    'bolao': bolao,
    'participantes': participantes.map((e) => e.toJson()).toList(),
    'sorteios': sorteios.map((e) => e.toJson()).toList(),
  };
}

class ParticipanteDto {
  final int usuarioId;
  final int inscricaoId;
  final String nome;
  final List<String> valoresEscolhidos;
  final int pontuacaoTotal;
  final int posicao;
  final List<String> valoresAcertados;
  final bool apto;

  ParticipanteDto({
    required this.usuarioId,
    required this.inscricaoId,
    required this.nome,
    required this.valoresEscolhidos,
    required this.pontuacaoTotal,
    required this.posicao,
    required this.valoresAcertados,
    required this.apto,
  });

  factory ParticipanteDto.fromJson(Map<String, dynamic> json) {
    return ParticipanteDto(
      usuarioId: json['usuarioId'] as int? ?? 0,
      inscricaoId: json['inscricaoId'] as int? ?? 0,
      nome: json['nome'] as String? ?? '',
      valoresEscolhidos:
          (json['valoresEscolhidos'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      pontuacaoTotal: json['pontuacaoTotal'] as int? ?? 0,
      posicao: json['posicao'] as int? ?? 0,
      valoresAcertados:
          (json['valoresAcertados'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      apto: json['apto'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'usuarioId': usuarioId,
    'inscricaoId': inscricaoId,
    'nome': nome,
    'valoresEscolhidos': valoresEscolhidos,
    'pontuacaoTotal': pontuacaoTotal,
    'posicao': posicao,
    'valoresAcertados': valoresAcertados,
    'apto': apto,
  };
}

class SorteioResumoDto {
  final String nome;
  final List<String> valoresSorteados;

  SorteioResumoDto({required this.nome, required this.valoresSorteados});

  factory SorteioResumoDto.fromJson(Map<String, dynamic> json) {
    return SorteioResumoDto(
      nome: json['nome'] as String? ?? '',
      valoresSorteados:
          (json['valoresSorteados'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() => {
    'nome': nome,
    'valoresSorteados': valoresSorteados,
  };
}
