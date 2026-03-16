package com.saulotorres.BlioBook.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.saulotorres.BlioBook.entities.Autor;

@Repository
public interface AutorRepository extends JpaRepository<Autor, Long> {}