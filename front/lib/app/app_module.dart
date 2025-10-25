import 'package:flutter_modular/flutter_modular.dart';
import 'package:flutter/material.dart';
import '../main.dart';

class AppModule extends Module {
  @override
  void routes(RouteManager r) {
    r.child(
      '/',
      child: (context) => const MyHomePage(title: 'Flutter Modular Home'),
    );
    // Adicione outras rotas aqui
  }
}
