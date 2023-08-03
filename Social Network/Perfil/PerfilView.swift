//
//  PerfilView.swift
//  Social Network
//
//  Created by Erick Leonardo Weil on 03/08/23.
//
import SwiftUI

struct PerfilUsuario_Previews: PreviewProvider {
    static var previews: some View {
        PerfilUsuario()
    }
}


struct TriangleShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        
        path.move(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        
        path.closeSubpath()
        
        return path
    }
}

struct PerfilUsuario: View {
    var body: some View {
        ZStack(alignment: .top) {
            // Fundo
            FundoView(cor1: .accentColor, cor2: .primary)
            
            // Informações
            VStack {
                InformacoesPerfil()
                DetalhesPerfil()
                    .frame(maxWidth: 450)
            }
        }
    }
}

struct FundoView: View {
    var cor1: Color
    var cor2: Color
    var body: some View {
        VStack(spacing:0) {
            VStack {
                Spacer()
                TriangleShape()
                    .frame(height: 60)
                    .foregroundColor(Color(.systemBackground))
            }
            .frame(height: 280)
            .background {
                //LinearGradient(colors: [cor1,cor2], startPoint: .topLeading, endPoint: .bottomTrailing)
                //    .frame(height: 280)
                Image("CapaPerfil")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    
            }
            Color(.systemBackground)
        }.edgesIgnoringSafeArea(.all)
    }
}

struct InformacoesPerfil: View {
    var body: some View {
        VStack(spacing:16) {
            Text("Wanilk Caldas")
                .font(.largeTitle)
            Text("CEO")
            HStack {
                Image(systemName: "location.fill")
                Text("Vilhena - RO")
            }
            
            HStack(alignment: .bottom, spacing: 25) {
                Image(systemName: "phone.circle.fill")
                    .renderingMode(.original)
                    .resizable()
                    .frame(width: 40, height: 40)
                
                Image("FotoPerfil")
                    .resizable()
                    .frame(width: 150, height: 150)
                    .clipShape(Circle())
                    .overlay {
                        Circle()
                            .stroke(lineWidth: 8.0)
                            .foregroundColor(Color(.systemBackground))
                    }
                
                Image(systemName: "message.circle.fill")
                    .renderingMode(.original)
                    .resizable()
                    .frame(width: 40, height: 40)
            }
            
        }
        .foregroundColor(.white)
        .font(.title3)
    }
}

struct DetalhesPerfil: View {
    var body: some View {
        VStack {
            Text("Sobre")
                .font(.largeTitle)
            Text("Gerente da maior empresa da região Vilhena, no setor automobilístico")
                .font(.body)
            
            HStack(spacing:30) {
                VStack{
                    Text("Postagens").foregroundColor(.gray)
                    Text("333").bold()
                }
                VStack{
                    Text("Seguidores").foregroundColor(.gray)
                    Text("333").bold()
                }
                VStack{
                    Text("Seguindo").foregroundColor(.gray)
                    Text("333").bold()
                }
            }.padding()
            
            VStack(alignment: .leading, spacing:16) {
                HStack {
                    Image(systemName: "envelope")
                    Text("wanilk_caldas@exemplo.com")
                }
                HStack {
                    Image(systemName: "birthday.cake")
                    Text("31 de Fevereiro de 1900")
                }
                HStack {
                    Image(systemName: "person")
                    Text("Não informado")
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding()
            
            Button {
                print("Clicou")
            } label: {
                ZStack {
                    RoundedRectangle(cornerRadius: 40)
                    Text("SEGUIR")
                        .bold()
                        .foregroundColor(.white)
                }.frame(width: 200, height: 60)
            }
        }
    }
}
