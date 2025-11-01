import 'package:flutter/material.dart';
import 'package:flutter_modular/flutter_modular.dart';
import 'package:sorteio_front/core/utils/constants.dart';

class AppWidget extends StatelessWidget {
  const AppWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Bolao dos Amigos',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Constants.primary,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'NotoSans',
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Constants.primary,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        fontFamily: 'NotoSans',
      ),
      themeMode: ThemeMode.light,
      routerConfig: Modular.routerConfig,
    );
  }
}
