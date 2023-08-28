//
//  ContentView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 01/07/23.
//

import SwiftUI

// View que lista as postagens
struct InicioView: View {
    var body: some View {
        PostagemListView()
    }
}

struct InicioView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            LoginView() {
                InicioView()
                    .navigationBarBackButtonHidden(true)
            }
        }.environmentObject(AppDataStore(httpClient: HTTPClient()))
    }
}
