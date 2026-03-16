package com.saulotorres.BlioBook.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.saulotorres.BlioBook.entities.Livro;
import com.saulotorres.BlioBook.repository.LivroRepository;

@Service
public class LivroService {

    @Autowired
    private LivroRepository repository;

    public List<Livro> listar() {
        return repository.findAll();
    }

    public Livro buscar(@NonNull Long id) {
        return repository.findById(id).orElse(null);
    }

    public Livro salvar(@NonNull Livro livro) {
        return repository.save(livro);
    }

    public void excluir(@NonNull Long id) {
        repository.deleteById(id);
    }
}