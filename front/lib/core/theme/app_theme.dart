import 'package:flutter/material.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class AppTheme {
  static ThemeData get light {
    return ThemeData(
      primaryColor: Constants.primary,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Constants.primary,
        secondary: Constants.backgroundLight,
      ),
      useMaterial3: true,
    );
  }

  static ThemeData get dark {
    return ThemeData(
      primaryColor: const Color(0xFFFF441A),
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFFFF441A),
        secondary: const Color(0xFFFF07C2),
        brightness: Brightness.dark,
      ),
      useMaterial3: true,
    );
  }
}
