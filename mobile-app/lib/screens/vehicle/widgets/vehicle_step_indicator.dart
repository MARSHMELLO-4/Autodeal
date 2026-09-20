import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';

class VehicleStepIndicator extends StatelessWidget {
  const VehicleStepIndicator({
    required this.currentStep,
    required this.steps,
    required this.onStepTap,
    super.key,
  });

  final int currentStep;
  final List<String> steps;
  final ValueChanged<int> onStepTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
            child: Row(
              children: List.generate(steps.length, (index) {
                final isCurrent = index == currentStep;
                final isCompleted = index < currentStep;

                return Row(
                  children: [
                    InkWell(
                      borderRadius: BorderRadius.circular(20),
                      onTap: index <= currentStep
                          ? () => onStepTap(index)
                          : null,
                      child: Row(
                        children: [
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 240),
                            curve: Curves.easeOutCubic,
                            width: isCurrent ? 26 : 24,
                            height: isCurrent ? 26 : 24,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: isCurrent || isCompleted
                                  ? AppColors.brandGradient
                                  : null,
                              color: isCurrent || isCompleted
                                  ? null
                                  : const Color(0xffefebe4),
                              boxShadow: isCurrent
                                  ? [
                                      BoxShadow(
                                        color: AppColors.maroon700
                                            .withValues(alpha: 0.3),
                                        blurRadius: 8,
                                        offset: const Offset(0, 3),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: isCompleted
                                ? const Icon(
                                    Icons.check_rounded,
                                    size: 15,
                                    color: Colors.white,
                                  )
                                : Text(
                                    '${index + 1}',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      color: isCurrent
                                          ? Colors.white
                                          : AppColors.moss,
                                    ),
                                  ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            steps[index],
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight:
                                  isCurrent ? FontWeight.w800 : FontWeight.w600,
                              color: isCurrent || isCompleted
                                  ? AppColors.maroon700
                                  : AppColors.moss,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (index < steps.length - 1)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 240),
                          width: 26,
                          height: 2,
                          decoration: BoxDecoration(
                            color: index < currentStep
                                ? AppColors.maroon600
                                : AppColors.hairedge,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                  ],
                );
              }),
            ),
          ),
          ClipRRect(
            borderRadius: BorderRadius.circular(99),
            child: LinearProgressIndicator(
              value: (currentStep + 1) / steps.length,
              minHeight: 4,
              backgroundColor: AppColors.maroon100,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.maroon700),
            ),
          ),
        ],
      ),
    );
  }
}