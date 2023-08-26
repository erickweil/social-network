//
//  UsuarioModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import Foundation

// Structs para fazer o parse do JSON que a api responde
struct Usuario: Hashable, Codable, Identifiable {
    var id: String { _id }
    let _id: String
    let nome: String
    let fotoPerfil: String
    let fotoCapa: String
    let biografia: String
    let created_at: String
    let updated_at: String
}

struct LoginResponse: Hashable, Codable {
    let token: String
    let usuario: Usuario
}

typealias ListagemUsuario = ListagemDeAlgo<Usuario>
