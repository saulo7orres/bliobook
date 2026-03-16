package com.saulotorres.BlioBook.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.saulotorres.BlioBook.entities.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}