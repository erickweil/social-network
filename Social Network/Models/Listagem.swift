//
//  Listagem.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 26/08/23.
//

import Foundation

struct ListagemDeAlgo<T: Codable & Hashable & Identifiable>: Codable, Hashable {
    let pagina: Int
    let limite: Int
    let resposta: [T]
}
