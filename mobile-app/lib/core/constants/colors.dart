import 'package:flutter/material.dart';

/// Brand palette for Shree Ganesh Autodeal.
///
/// The visual language is a red · white · maroon system:
///  - [maroonRoot] and the `maroon*` scale anchor the brand (deep maroon/reds).
///  - [crimson] / [red] are the vivid "action" accents.
///  - `paper*` and [white] form the warm, clean canvas.
class AppColors {
  AppColors._();

  // ---------------------------------------------------------------------------
  // Brand maroon scale (anchored on #991b1b for brand fidelity)
  // ---------------------------------------------------------------------------
  static const Color maroon50 = Color(0xfffdf3f3);
  static const Color maroon100 = Color(0xfffbe4e5);
  static const Color maroon200 = Color(0xfff6c8ca);
  static const Color maroon300 = Color(0xffed9ba0);
  static const Color maroon400 = Color(0xffdf6a71);
  static const Color maroon500 = Color(0xffc53d47);
  static const Color maroon600 = Color(0xffa91f2b);
  static const Color maroon700 = Color(0xff991b1b);
  static const Color maroon800 = Color(0xff7f1d1d);
  static const Color maroon900 = Color(0xff5c1616);

  // ---------------------------------------------------------------------------
  // Vivid accents
  // ---------------------------------------------------------------------------
  static const Color crimson = Color(0xffe11d33);
  static const Color red = Color(0xffdc2626);
  static const Color redSoft = Color(0xfffdecec);
  static const Color amber = Color(0xfff59e0b);

  // ---------------------------------------------------------------------------
  // Surfaces
  // ---------------------------------------------------------------------------
  static const Color paper = Color(0xfffaf8f4);
  static const Color white = Colors.white;
  static const Color hairedge = Color(0xffe9e3d8);
  static const Color divider = Color(0xfff2eee6);

  // ---------------------------------------------------------------------------
  // Inks & neutrals
  // ---------------------------------------------------------------------------
  static const Color ink = Color(0xff1c1917);
  static const Color moss = Color(0xff726c63);
  static const Color slatePlaceholder = Color(0xff9ca3af);

  // ---------------------------------------------------------------------------
  // Status colors
  // ---------------------------------------------------------------------------
  static const Color statusAvailable = Color(0xff059669);
  static const Color statusReserved = Color(0xffa15c00);
  static const Color statusSold = Color(0xff686d74);

  // ---------------------------------------------------------------------------
  // Reusable decorations
  // ---------------------------------------------------------------------------

  /// Signature brand gradient used by primary CTAs.
  static const LinearGradient brandGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xffc22a31), Color(0xff991b1b), Color(0xff7f1d1d)],
  );

  /// Soft blush gradient for hero surfaces.
  static const LinearGradient blushGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xfffdecec), Color(0xfffff6ef), Color(0xfffaf8f4)],
  );

  /// Scrim over thumbnail images to guarantee text contrast.
  static const BoxShadow cardShadow = BoxShadow(
    color: Color(0x1f1c1917),
    blurRadius: 24,
    offset: Offset(0, 10),
  );
}