import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import '../constants/colors.dart';

/// Central design token + theme builder for the owner app.
///
/// Everything downstream (screens, dialogs, shared widgets) should read
/// tokens from [AppTheme] / [AppColors] so the whole app stays on the
/// red · white · maroon system and is easy to re-skin later.
class AppTheme {
  AppTheme._();

  // ---------------------------------------------------------------------------
  // Shape & motion tokens
  // ---------------------------------------------------------------------------
  static const double radiusSm = 12;
  static const double radiusMd = 16;
  static const double radiusLg = 22;
  static const double radiusFull = 999;

  static const Duration durationFast = Duration(milliseconds: 160);
  static const Duration durationBase = Duration(milliseconds: 260);
  static const Duration durationSlow = Duration(milliseconds: 420);

  // ---------------------------------------------------------------------------
  // Color scheme (M3 light)
  // ---------------------------------------------------------------------------
  static final ColorScheme lightColorScheme = ColorScheme.fromSeed(
    seedColor: AppColors.maroon700,
    brightness: Brightness.light,
    primary: AppColors.maroon700,
    onPrimary: Colors.white,
    primaryContainer: AppColors.maroon100,
    onPrimaryContainer: AppColors.maroon900,
    secondary: AppColors.crimson,
    onSecondary: Colors.white,
    secondaryContainer: AppColors.redSoft,
    onSecondaryContainer: const Color(0xff5f0a0a),
    tertiary: AppColors.red,
    onTertiary: Colors.white,
    error: const Color(0xffdc2626),
    onError: Colors.white,
    surface: AppColors.paper,
    onSurface: AppColors.ink,
    onSurfaceVariant: AppColors.moss,
    outline: AppColors.hairedge,
    outlineVariant: AppColors.divider,
    surfaceContainerHighest: const Color(0xffefebe4),
    surfaceContainer: const Color(0xffffffff),
  );

  // ---------------------------------------------------------------------------
  // Typography
  // ---------------------------------------------------------------------------
  static TextTheme buildTextTheme() {
    final base = GoogleFonts.montserratTextTheme();
    return base.copyWith(
      headlineLarge: base.headlineLarge?.copyWith(
        fontWeight: FontWeight.w800,
        letterSpacing: -0.5,
        color: AppColors.ink,
      ),
      headlineMedium: base.headlineMedium?.copyWith(
        fontWeight: FontWeight.w800,
        letterSpacing: -0.3,
        color: AppColors.ink,
      ),
      titleLarge: base.titleLarge?.copyWith(
        fontWeight: FontWeight.w700,
        color: AppColors.ink,
      ),
      titleMedium: base.titleMedium?.copyWith(
        fontWeight: FontWeight.w700,
        color: AppColors.ink,
      ),
      titleSmall: base.titleSmall?.copyWith(
        fontWeight: FontWeight.w600,
        color: AppColors.ink,
      ),
      bodyLarge: base.bodyLarge?.copyWith(color: AppColors.ink),
      bodyMedium: base.bodyMedium?.copyWith(color: AppColors.ink),
      labelLarge: base.labelLarge?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: 0.2,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Component themes
  // ---------------------------------------------------------------------------
  static ThemeData light() {
    final scheme = lightColorScheme;
    final textTheme = buildTextTheme();

    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      textTheme: textTheme,
      scaffoldBackgroundColor: AppColors.paper,
      splashFactory: InkSparkle.splashFactory,

      // ---- App bar ----------------------------------------------------------
      appBarTheme: AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        backgroundColor: AppColors.paper,
        foregroundColor: AppColors.ink,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w800,
          fontSize: 20,
          color: AppColors.ink,
        ),
        iconTheme: const IconThemeData(color: AppColors.ink),
        systemOverlayStyle: SystemUiOverlayStyle.dark,
      ),

      // ---- Cards ------------------------------------------------------------
      cardTheme: CardThemeData(
        elevation: 0,
        color: AppColors.white,
        surfaceTintColor: Colors.transparent,
        shadowColor: AppColors.ink.withValues(alpha: 0.10),
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        ),
      ),

      // ---- Inputs -----------------------------------------------------------
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.white,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        hintStyle: TextStyle(color: AppColors.moss.withValues(alpha: 0.7)),
        labelStyle: const TextStyle(color: AppColors.moss),
        floatingLabelStyle:
            const TextStyle(color: AppColors.maroon700, fontWeight: FontWeight.w600),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: AppColors.hairedge),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: AppColors.hairedge),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: AppColors.maroon600, width: 1.8),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: AppColors.red, width: 1.4),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: AppColors.red, width: 1.8),
        ),
        prefixIconColor: AppColors.moss,
        suffixIconColor: AppColors.maroon600,
      ),

      // ---- Buttons ----------------------------------------------------------
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.maroon700,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.maroon300,
          disabledForegroundColor: Colors.white,
          minimumSize: const Size(48, 50),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.maroon700,
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppTheme.radiusSm),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.ink,
          minimumSize: const Size(48, 50),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
          side: const BorderSide(color: AppColors.hairedge),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      iconButtonTheme: IconButtonThemeData(
        style: IconButton.styleFrom(
          foregroundColor: AppColors.ink,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppTheme.radiusSm),
          ),
        ),
      ),

      // ---- Chips & pills ----------------------------------------------------
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.white,
        selectedColor: AppColors.maroon700,
        labelStyle:
            textTheme.labelLarge?.copyWith(color: AppColors.ink, fontSize: 13),
        secondaryLabelStyle: const TextStyle(color: Colors.white),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusFull),
          side: const BorderSide(color: AppColors.hairedge),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.hairedge,
        thickness: 1,
        space: 1,
      ),

      // ---- Navigation -------------------------------------------------------
      navigationBarTheme: const NavigationBarThemeData(
        height: 68,
        elevation: 0,
        backgroundColor: AppColors.white,
        indicatorColor: AppColors.maroon100,
        indicatorShape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(18)),
        ),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        iconTheme: WidgetStatePropertyAll(IconThemeData(
          color: AppColors.moss,
          size: 24,
        )),
        labelTextStyle: WidgetStatePropertyAll(TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: AppColors.moss,
        )),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.white,
        surfaceTintColor: Colors.transparent,
        showDragHandle: true,
        dragHandleColor: AppColors.hairedge,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
      ),

      // ---- Dialog / snackbar --------------------------------------------------
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.white,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        ),
        titleTextStyle: textTheme.titleLarge?.copyWith(fontSize: 18),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.ink,
        contentTextStyle: const TextStyle(color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        ),
      ),

      // ---- Progress -----------------------------------------------------------
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.maroon700,
        linearTrackColor: AppColors.maroon100,
        circularTrackColor: AppColors.maroon100,
      ),

      // ---- Page transitions ---------------------------------------------------
      pageTransitionsTheme: const PageTransitionsTheme(builders: {
        TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      }),
    );
  }
}