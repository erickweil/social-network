//
//  LoginViewModel.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 05/09/23.
//

import Foundation
import SwiftUI

extension LoginView {
    class ViewModel: ObservableObject {
        @AppStorage("AUTH_USER") var username = ""
        @AppStorage("AUTH_PASSWORD") var password = ""
        
        @Published var msgLoginInvalido = false
        
        private var sampleUser = "username"
        private var samplePassword = "password"
        
        init() {
            print("Usuário: \(username)")
        }
        
        func logPressed() {
            print("Button pressed.")
        }
    }
}
