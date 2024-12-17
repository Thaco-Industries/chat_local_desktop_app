pipeline {
    agent any

    stages {
        stage('Hello world') {
            steps {
               echo 'Hello world build front end ne'
            }
        }
        stage('Remove container') {
            steps {
                bat 'docker rm -f chat_rd_desktop'
            }
        }
        stage('edit config env file setup') {
            steps {
                script {
                    dir('D:/tydang/jenkins/data/workspace/chat_fe_desktop') {
                        bat 'copy /Y .env.example_i9 .env'
                    }
                }
            }
        }
        stage('Remove image') {
            steps {
                bat 'docker rmi tymonstarlab/chat_rd_desktop'
            }
        }
        stage('Build images') {
            steps {
                script {
                    dir('D:/tydang/jenkins/data/workspace/chat_fe_desktop') {
                        bat 'docker build -t tymonstarlab/chat_rd_desktop .'
                    }
                }
            }
        }
       stage('Restart container') {
            steps {
                script {
                    dir('D:/tydang/jenkins/data/workspace/chat_fe_desktop') {
                        bat 'docker compose up -d'
                    }
                }
            }
        }
    }
}