import 'dart:ui';

import 'package:flutter/foundation.dart';

class Constants {
  static const String appName = 'Hangout';
  static const String appVersion = '1.0.0';

  static const String urlWeb = 'http://localhost:8080/api';
  static const String urlMobile = 'https://sorteio-zf88.onrender.com/api'; 
  //'http://192.168.1.2:8080/api';

  String get baseUrl {
    if (kIsWeb) {
      return urlWeb;
    }
    return urlMobile;
  }
  //static const String baseUrl = 'http://localhost:8080/api/usuarios';

  // Storage Keys
  static String token = 'token';
  //static const String userKey = 'user';

  // Asset Paths
  static const String logoPath = 'assets/images/logo.png';

  // Navigation Routes
  static const String initialRoute = '/';
  static const String homeRoute = '/home';
  static const String loginRoute = '/login';
  static const String registerRoute = '/register';

  static const Color primary = Color(0xFF166534);
  static const Color backgroundLight = Color(0xFFF3EFEA);
  static const Color textLight = Color(0xFF4F4F4F);
  static const Color textPrimary = Color(0xFF0F1720);
  static const Color lightGray = Color(0xFFD9D9D9);
}
