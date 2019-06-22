import React, { Component } from 'react';
import Toast, {DURATION} from 'react-native-easy-toast'
import api from '../services/api';
import ImagePicker from 'react-native-image-picker';

import preview from '../assets/preview.png';

import { View, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Text, TextInput, Image } from 'react-native';

// import { Container } from './styles';

export default class New extends Component {
  static navigationOptions = {
    headerTitle: 'New post',
  };

  state = {
    preview: preview,
    image: null,
    author: '',
    place: '',
    description: '',
    hashtags: '',
    loading: false,
  };

  handleSelectImage = () => {
    ImagePicker.showImagePicker({
      title: 'Select picture',
    }, upload => {
      if (upload.error) {
        console.log('Error');
      } else if (upload.didCancel) {
        console.log('User cancel');
      } else {
        const preview = {
          uri: `data:image/jpeg;base64,${upload.data}`,
        }

        //Handling the file name specially because iOS sucks
        let prefix, ext;

        if (upload.fileName) {
          [prefix, ext] = upload.fileName.split('.');
          ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
        } else {
          prefix = new Date().getTime();
          ext = 'jpg';
        }

        const image = {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        };

        this.setState({ preview, image });
      }
    })
  }

  handleSubmit = async e => {
    //this.setState({ loading: true });
    console.log(this.state.author);
    console.log(this.state.description);
    console.log(this.state.hashtags);
    console.log(this.state.place);
    if (
      this.state.author === ''
      || this.state.description === ''
      || this.state.hashtags === ''
      || this.state.place === ''
    ) {

      this.refs.toast.show('Tell us more about your post.', 800);
      
    } else {

      console.log('Vou mandar pro back');

      const data = new FormData();
      data.append('image', this.state.image);
      data.append('author', this.state.author);
      data.append('place', this.state.place);
      data.append('description', this.state.description);
      data.append('hashtags', this.state.hashtags);
      
      await api.post('posts', data).then(() => {
          this.setState({ loading: false });
      });

      this.props.navigation.navigate('Feed');

    }

  }

  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.imageSection}>
        
          <TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
            <Text style={styles.selectButtonText}>Select picture</Text>
          </TouchableOpacity>
        
          <Image style={styles.preview} source={this.state.preview} />
        
        </View>

        <TextInput
          style={styles.input}
          autoCorrect={false}
          placeholder="Author"
          placeholderTextColor="#999"
          value={this.state.author}
          onChangeText={author => this.setState({ author })}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          placeholder="Place"
          placeholderTextColor="#999"
          value={this.state.place}
          onChangeText={place => this.setState({ place })}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          placeholder="Description"
          placeholderTextColor="#999"
          value={this.state.description}
          onChangeText={description => this.setState({ description })}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Hashtags"
          placeholderTextColor="#999"
          value={this.state.hashtags}
          onChangeText={hashtags => this.setState({ hashtags })}
        />

        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={this.handleSubmit}
          disabled={loading}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>

        <Toast 
          ref="toast"
          style={{backgroundColor:'#232323'}}
          position='top'
          positionValue={20}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  imageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    flex: 1,
    marginRight: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});