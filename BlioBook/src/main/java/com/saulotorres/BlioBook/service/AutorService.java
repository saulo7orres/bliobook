package com.saulotorres.BlioBook.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.saulotorres.BlioBook.entities.Autor;
import com.saulotorres.BlioBook.repository.AutorRepository;

@Service
public class AutorService {

    @Autowired
    private AutorRepository repository;

    public List<Autor> listar() {
        return repository.findAll();
    }

    public Autor buscar(@NonNull Long id) {
        return repository.findById(id).orElse(null);
    }

    public Autor salvar(@NonNull Autor autor) {
        return repository.save(autor);
    }

    public void excluir(@NonNull Long id) {
        repository.deleteById(id);
    }
}