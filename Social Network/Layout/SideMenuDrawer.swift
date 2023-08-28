//
//  SideMenuDrawer.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 28/08/23.
//

import SwiftUI

extension View {
    func sideMenuDrawer<C: View>(menuContent: C) -> some View {
        modifier(SideMenuDrawer(menuContent: content))
    }
}

struct SideMenuDrawer<C>: ViewModifier where C: View {
    @State
    var menuOpened: Bool = false
    
    var menuContent: () -> C
    
    func body(content: Content) -> some View {
        
        content
        .overlay {
            if menuOpened {
                Color(.gray)
                    .opacity(0.5)
                    .transition(.opacity)
                
                menuContent()
                .padding()
                .background(Color(.systemBackground))
                .padding(.trailing, 100)
                .transition(.move(edge: .leading))
            }
            
        }
        .onTapGesture {
            withAnimation(.easeIn(duration: 0.15)) {
                menuOpened.toggle()
            }
        }
    }
}


struct SideMenuDrawerTeste: View {
    var body: some View {
        ViewExample(imageName: "phone.fill", color: .systemRed)
            .modifier(SideMenuDrawer(menuContent: {
                VStack(alignment: .leading) {
                    Color(.lightGray)
                        .frame(width: 60,height:60)
                        .clipShape(Circle())
                    
                    Color(.lightGray)
                    .frame(height: 17.0)
                    .padding(.top, 10)
                    
                    Color(.lightGray)
                    .frame(height: 17.0)
                    .padding(.top, 10)
                    
                    Divider()
                    
                    Spacer()
                }
            }))
    }
}

struct SideMenuDrawer_Previews: PreviewProvider {
    static var previews: some View {
        SideMenuDrawerTeste()
    }
}
