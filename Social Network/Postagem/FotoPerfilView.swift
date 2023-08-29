//
//  FotoPerfilView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

struct FotoPerfilView: View {
    // Estado global da aplicação
    @EnvironmentObject private var store: AppDataStore
    
    var imgPath: String
    var width: CGFloat
        
    init(imgPath: String, width: CGFloat = 60) {
        self.imgPath = imgPath
        self.width = width
    }
    
    var body: some View {
        URLImage(
            url: APIs.baseURL.appendingPathComponent(imgPath),
            imageCache: store.imageCache)
        {
            defaultPlaceholder()
        }
        .frame(width: width)
        .clipShape(Circle())
        .foregroundColor(.secondary)
    }
}

struct FotoPerfilView_Previews: PreviewProvider {
    static var previews: some View {
        FotoPerfilView(imgPath: "/img/64c0251e2296e61e0f501ba7/98ccd7ed-0163-47dd-8dba-4ad5243b7cb3.jpg")
            .environmentObject(AppDataStore(httpClient: HTTPClient()))
    }
}
