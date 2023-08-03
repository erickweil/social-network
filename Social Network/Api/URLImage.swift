//
//  URLImage.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 03/08/23.
//

import SwiftUI

// Diz que no ios 15 para cima não precisaria disso...
struct URLImage: View {
    let urlString: String
    @State var data: Data?
    var body: some View {
        if let data = data, let uiimage = UIImage(data: data) {
            Image(uiImage: uiimage)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .background(Color.gray)
        } else {
            Image(systemName: "person.crop.rectangle")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .background(Color.gray)
                .onAppear {
                    fetchData()
                }
        }
    }
    
    // Tem que ver a questão do cache
    private func fetchData() {
        print("Carregando \(urlString)")
        guard let url = URL(string: urlString) else {
            print("Falhou carregar \(urlString)")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue(PostagensViewModel.session_token, forHTTPHeaderField: "Authorization")
        
        let task = PostagensViewModel.getSession().dataTask(with: request) {
            data, _, _ in
            self.data = data
        }
        task.resume()
    }
}

struct URLImage_Previews: PreviewProvider {
    static var previews: some View {
        URLImage(urlString: APIURL+"/img/64c0251e2296e61e0f501ba7/98ccd7ed-0163-47dd-8dba-4ad5243b7cb3.jpg")
    }
}
