package com.saulotorres.BlioBook.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.saulotorres.BlioBook.entities.Categoria;
import com.saulotorres.BlioBook.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    public List<Categoria> listar() {
        return repository.findAll();
    }

    public Categoria buscar(@NonNull Long id) {
        return repository.findById(id).orElse(null);
    }

    public Categoria salvar(@NonNull Categoria categoria) {
        return repository.save(categoria);
    }

    public void excluir(@NonNull Long id) {
        repository.deleteById(id);
    }
}