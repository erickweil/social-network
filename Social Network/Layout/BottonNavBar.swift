//
//  BottonNavBar.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

struct BottonNavBar: View {
    var body: some View {
        TabView {
            ViewExample(imageName: "phone.fill", color: .systemRed)
            ViewExample(imageName: "person.2.fill", color: .systemBlue).badge(99)
            ViewExample(imageName: "slider.horizontal.3", color: .systemGreen)
        }
    }
}


struct ViewExample: View {
    var imageName: String
    var color: UIColor
    var body: some View {
        ZStack {
            Color(color)
            
            Image(systemName: imageName)
                .renderingMode(.template)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .foregroundColor(.white)
                .frame(width: 100,height: 100)
        }
        .tabItem() {
            Image(systemName: imageName)
        }
    }
}

struct BottonNavBar_Previews: PreviewProvider {
    static var previews: some View {
        BottonNavBar()
    }
}
