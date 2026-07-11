package com.autodeal.ShreeGaneshAutodeal.repository;

import com.autodeal.ShreeGaneshAutodeal.domain.Category;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	Optional<Category> findBySlug(String slug);

	boolean existsByNameIgnoreCase(String name);

	boolean existsBySlug(String slug);
}
