class TokenDTO {
  final String message;
  final String? token;

  TokenDTO({
    required this.message,
    required this.token,
  });

  factory TokenDTO.fromJson(Map<String, dynamic> json) {
    return TokenDTO(
      message: json['message'] as String? ?? '',
      token: json['token'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'message': message,
      'token': token,
    };
  }
}
