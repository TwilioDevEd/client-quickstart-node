﻿$(function () {
  const speakerDevices = document.getElementById('speaker-devices');
  const ringtoneDevices = document.getElementById('ringtone-devices');
  const outputVolumeBar = document.getElementById('output-volume');
  const inputVolumeBar = document.getElementById('input-volume');
  const volumeIndicators = document.getElementById('volume-indicators');
  const callButton = document.getElementById('button-call');
  const hangupButton = document.getElementById('button-hangup');
  const callControlsDiv = document.getElementById('call-controls');
  const audioSelectionDiv = document.getElementById('output-selection');
  const getAudioDevicesButton = document.getElementById('get-devices');
  const logDiv = document.getElementById("log");
  const incomingCallDiv = document.getElementById("incoming-call");
  const incomingCallHangupButton = document.getElementById("button-hangup-incoming");
  const incomingCallAcceptButton = document.getElementById("button-accept-incoming");
  const incomingCallRejectButton = document.getElementById("button-reject-incoming");
  const phoneNumberInput = document.getElementById("phone-number");
  const incomingPhoneNumberEl = document.getElementById("incoming-number");
  const startupButton = document.getElementById("startup-button");

  let device;
  let token;


  // Event Listeners

  callButton.onclick = (e) => {
    e.preventDefault();
    makeOutgoingCall();
  }
  getAudioDevicesButton.onclick = getAudioDevices;
  speakerDevices.addEventListener("change", updateOutputDevice);
  ringtoneDevices.addEventListener("change", updateRingtoneDevice);
  hangupButton.onclick = hangup;


  // SETUP STEP 1: 
  // Browser client should be started after a user gesture
  // to avoid errors in the browser console re: AudioContext
  startupButton.addEventListener('click', startupClient)


  // SETUP STEP 2: Request an Access Token
  async function startupClient() {
    
    log('Requesting Access Token...');
    
    try {
      const data = await $.getJSON('/token')
      log('Got a token.');
      token = data.token;
      setClientNameUI(data.identity);
      intitializeDevice();  
    } 
    catch (err) {
      console.log(err);
      log("An error occurred. See your browser console for more information.");
    }

  }

  // SETUP STEP 3: 
  // Instantiate a new Twilio.Device
  function intitializeDevice() {
    log("Initializing device")
    device = new Twilio.Device(token, {
      debug: true, 
      answerOnBridge: true,
      // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
      // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
      codecPreferences: ["opus", "pcmu"]
      // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
      // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
      // a second time and sending the tone twice.
    })

    addDeviceListeners(device);

    // Device must be registered in order to receive incoming calls
    device.register();
  }

  // SETUP STEP 4: 
  // Listen for Twilio.Device states
  function addDeviceListeners(device) {

    device.on("registered", function() {
      log("Twilio.Device Ready to make and receive calls!");
      callControlsDiv.classList.remove("hide");
    });

    device.on("error", function(error) {
      log("Twilio.Device Error: " + error.message);
    });
    
    device.on("incoming", handleIncomingCall);
            
    device.audio.on("deviceChange", updateAllAudioDevices.bind(device));
    
    // Show audio selection UI if it is supported by the browser.
    if (device.audio.isOutputSelectionSupported) {
      audioSelectionDiv.classList.remove("hide");
    }
  }


  // MAKE AN OUTGOING CALL

  async function makeOutgoingCall() {
    var params = { 
      // get the phone number to call from the DOM
      To: phoneNumberInput.value
    };

    if (device) {
      log(`Attempting to call ${params.To} ...`)
      
      // Twilio.Device.connect() returns a Call object
      const call = await device.connect({ params })

      // add listeners to the Call
      // "accepted" means the call has finished connecting and the state is now "open"
      call.addListener("accept", updateUIAcceptedCall);
      call.addListener("disconnect", updateUIDisconnectedCall);


    } else {
      log("Device not initialized")
    }
  }

  function updateUIAcceptedCall(call) {
    log("Call in progress ...")
    callButton.disabled = true;
    hangupButton.classList.remove("hide");
    volumeIndicators.classList.remove("hide");
    bindVolumeIndicators(call);
  }


  function updateUIDisconnectedCall() {
    log("Call disconnected.");
    callButton.disabled = false;
    hangupButton.classList.add("hide");
    volumeIndicators.classList.add("hide");
  }

  // HANG UP A CALL 

  function hangup() {
    log('Hanging up ...');
    if (device) {
      device.disconnectAll();
    }
  }

  
  // HANDLE INCOMING CALL
  
  function handleIncomingCall(call) {
    log(`Incoming call from ${call.parameters.From}`)
    
    //show incoming call div and incoming phone number
    incomingCallDiv.classList.remove("hide");
    incomingPhoneNumberEl.innerHTML = call.parameters.From;
    
    //add event listeners for Accept, Reject, and Hangup buttons
    incomingCallAcceptButton.onclick = () => {
      acceptIncomingCall(call);
    }
    
    incomingCallRejectButton.onclick = () => {
      rejectIncomingCall(call);
    }
    
    incomingCallHangupButton.onclick = () => {
      hangupIncomingCall(call);
    }
    
    // add event listener to call object
    call.addListener('cancel', handleDisconnectedIncomingCall)
  }
  
  
  // ACCEPT INCOMING CALL

  function acceptIncomingCall(call) {
    call.accept();
    
    //update UI
    log('Accepted incoming call.');
    incomingCallAcceptButton.classList.add("hide");
    incomingCallRejectButton.classList.add("hide");
  }
  
  // REJECT INCOMING CALL

  function rejectIncomingCall(call) {
    call.reject();
    
    log("Rejected incoming call");
    resetIncomingCallUI();
  }


  // HANG UP INCOMING CALL

  function hangupIncomingCall(call) {
    call.disconnect();

    log("Hung up incoming call.");
    resetIncomingCallUI();
  }

  // HANDLE CANCELLED INCOMING CALL  

  function handleDisconnectedIncomingCall(call) {
    call.disconnect();

    log("Incoming call ended.");
    resetIncomingCallUI();
  }


  // MISC USER INTERFACE

  // Activity log 
  function log(message) {
    logDiv.innerHTML += "<p>&gt;&nbsp;" + message + "</p>";
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  function setClientNameUI(clientName) {
    var div = document.getElementById("client-name");
    div.innerHTML = "Your client name: <strong>" + clientName + "</strong>";
  }

  function resetIncomingCallUI () {
    incomingPhoneNumberEl.innerHTML = "";
    incomingCallDiv.classList.add("hide");
  }

  
  // AUDIO CONTROLS

  async function getAudioDevices() {
    await navigator.mediaDevices.getUserMedia({ audio: true })
    updateAllAudioDevices.bind(device)
  }

  function updateAllAudioDevices() {
    if (device) {
      updateDevices(speakerDevices, device.audio.speakerDevices.get());
      updateDevices(ringtoneDevices, device.audio.ringtoneDevices.get());
    }
  }
  
  function updateOutputDevice() {
    var selectedDevices = [].slice
      .call(speakerDevices.children)
      .filter(function(node) {
        return node.selected;
      })
      .map(function(node) {
        return node.getAttribute("data-id");
      });

    device.audio.speakerDevices.set(selectedDevices);
  }

  function updateRingtoneDevice() {
    var selectedDevices = [].slice
      .call(ringtoneDevices.children)
      .filter(function(node) {
        return node.selected;
      })
      .map(function(node) {
        return node.getAttribute("data-id");
      });
  
    device.audio.ringtoneDevices.set(selectedDevices);
  }

  function bindVolumeIndicators(call) {
    call.on("volume", function(inputVolume, outputVolume) {
      var inputColor = "red";
      if (inputVolume < 0.5) {
        inputColor = "green";
      } else if (inputVolume < 0.75) {
        inputColor = "yellow";
      }

      inputVolumeBar.style.width = Math.floor(inputVolume * 300) + "px";
      inputVolumeBar.style.background = inputColor;

      var outputColor = "red";
      if (outputVolume < 0.5) {
        outputColor = "green";
      } else if (outputVolume < 0.75) {
        outputColor = "yellow";
      }

      outputVolumeBar.style.width = Math.floor(outputVolume * 300) + "px";
      outputVolumeBar.style.background = outputColor;
    });
  }


  // Update the available ringtone and speaker devices
  function updateDevices(selectEl, selectedDevices) {
    selectEl.innerHTML = "";

    device.audio.availableOutputDevices.forEach(function(device, id) {
      var isActive = selectedDevices.size === 0 && id === "default";
      selectedDevices.forEach(function(device) {
        if (device.deviceId === id) {
          isActive = true;
        }
      });

      var option = document.createElement("option");
      option.label = device.label;
      option.setAttribute("data-id", id);
      if (isActive) {
        option.setAttribute("selected", "selected");
      }
      selectEl.appendChild(option);
    });
  }
});
